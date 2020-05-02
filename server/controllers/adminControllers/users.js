require("dotenv").config();
const db = require("../../models");
const mongoose = require("mongoose");
const {Client} = require("@googlemaps/google-maps-services-js");
const client = new Client({});



const { User , Driver , Global , Ride , UserNotif } = db;

class Users {
  static async getListUsers(req, res,next) {
   try {
        const { range } = req.query
        if(range){
          let limit = JSON.parse(range)[1];
          let offset = JSON.parse(range)[0]; 
          const users = await User.find({}).limit(limit).skip(offset)
          .populate("rates" ,{stars:true , comment:true , hidden:true})
          const total = await User.find({}).countDocuments()

          return res.status(200).json({
            users,
            total
          });
        }else{
          const users = await User.find({})
          .populate("rates" ,{stars:true , comment:true , hidden:true})
          return res.status(200).json(users);
        }
        
    } catch (error) {
        return next({
            status :400,
            message:error.message
        })
    }
  }
  static async deleteNotif(req, res,next) {
    try {
        const { ids } = req.body 
         const doc = await UserNotif.deleteMany({
          _id: {
            $in:ids
          }
         })
         return res.status(200).json({
          status:200,
          message:`delete ${doc.deletedCount} notifications`
        });
     } catch (error) {
         return next({
             status :400,
             message:error.message
         })
     }
   }
  static async getNotifications(req, res,next) {
    try {
         const {id} = req.params
         if(mongoose.isValidObjectId(id)){
            const notifications = await UserNotif.find({
              user:id
            }).populate({
              path: 'ride',
            })
            if(notifications){
                return res.status(200).json(notifications);
            }else{
              return next({
                status :400,
                errorStatus:4,
                message:"notifications not found"
              })
           }
         }else{
          return next({
            status :400,
            errorStatus:4,
            message:"Invalid User id"
          })
         }
     } catch (error) {
         return next({
             status :400,
             message:error.message
         })
     }
   }
  
  static async getOneUser(req, res,next) {
    try {
         const {id} = req.params
         if(mongoose.isValidObjectId(id)){
            const user = await User.findById(id , 'email phone_number full_name push_id currentPosition')
            .populate("rates" ,{stars:true , comment:true , hidden:true})
            if(user){
             const ride = await Ride.findOne({
               client:user.id,
               status: {
                 $in:["accepted" , "started" , "money_collected"]
               }
             }).populate("driver", 
              { 
                email:true, 
                isActive:true, 
                isWorking:true,
                inMission:true,
                carCompany:true,
                carType:true,
                phoneNumber:true, 
                firstName:true,
                lastName:true,
                push_id:true,
                rates:true,
                city:true,
                currentPosition:true
              })
              const {rates} = user
              const sommeRates  = rates.reduce((accumulator, currentValue) => accumulator + parseFloat(currentValue.stars), 0)
              const rate = Math.round(sommeRates / rates.length).toFixed(1)
              delete user.rates
              if(ride){
                return res.status(200).json({user:{...user.toObject() , rates:[] , rate},activeRide:ride});
              }else{
                return res.status(200).json({user:{...user.toObject() , rates:[] , rate},activeRide:null});
              }  
            }else{
              return next({
                status :400,
                errorStatus:4,
                message:"User Not Found"
              })
           }
         }else{
          return next({
            status :400,
            errorStatus:4,
            message:"Invalid User id"
          })
         }
     } catch (error) {
         return next({
             status :400,
             message:error.message
         })
     }
   }

   static async deleteUser(req, res,next) {
    try {
        const { filter } = req.query 
        const { id } = JSON.parse(filter);
         const user = await User.deleteMany({
          _id: {
            $in:id
          }
         })
         return res.status(200).json(user);
     } catch (error) {
         return next({
             status :400,
             message:error.message
         })
     }
   }
  static async getUserProfile(req, res,next) {
    try {
         const { id } = req.params
         if(id) {
          const users = await User.find({
            id
          })
          return res.status(200).json(users);
         }else{
           return next({
            status:400,
            errorStatus:5,
            message : "missing required param id"
           })
         }
         
     } catch (error) {
         return next({
             status :500,
             message:error.message
         })
     }
   }

   static async getListDrivers(req, res,next) {
    try {
      const parsedBody = Object.setPrototypeOf(req.body, {});
      if(parsedBody.hasOwnProperty("userPos") && parsedBody.hasOwnProperty("dist")){
        const { userPos , dist } = req.body
        let distanceTo = await client.distancematrix({
          params: {
            origins:[`${userPos[0]},${userPos[1]}`],
            destinations:[`${dist[0]},${dist[1]}`],
            key:process.env.GOOGLE_MAPS_API_KEY
          }
        }) 
        const param = await Global.findOne({name:'TARIF_SAR'})
        const price = distanceTo.data.rows[0].elements[0].distance.value && param ?
                      parseFloat(param.value) * (distanceTo.data.rows[0].elements[0].distance.value * 0.001) :
                      (distanceTo.data.rows[0].elements[0].distance.value * 0.001) * process.env.TARIF_SAR
        const driverList = await Driver.find({
          isActive: true,
          isWorking:true,
          inMission:false
        } , 'firstName lastName email isActive isWorking inMission carCompany rates carType phoneNumber currentPosition.coordinates images')
        .populate("rates" ,{stars:true , comment:true , hidden:true})
        let nearestDrivers = []
        for (const driver of driverList) {
            let maps = await client.distancematrix({
                        params: {
                          origins:[`${userPos[0]},${userPos[1]}`],
                          destinations:[`${driver.currentPosition.coordinates[0]},${driver.currentPosition.coordinates[1]}`],
                          key:process.env.GOOGLE_MAPS_API_KEY
                        }
                      }) 
            if(maps.data.rows[0].elements[0].distance.value <= 7000){
              const {rates} = driver
              const sommeRates  = rates.reduce((accumulator, currentValue) => accumulator + parseFloat(currentValue.stars), 0)
              const rate = Math.round(sommeRates / rates.length).toFixed(1)
              nearestDrivers.push({
                ...driver.toObject(),
                time: distanceTo.data.rows[0].elements[0].duration.value,
                distance: distanceTo.data.rows[0].elements[0].distance.value,
                price,
                rates:[],
                rate
              })
            }
        }

        return res.status(200).json({
          status : 200 , 
          nearestDrivers,
          distanceToDistination:distanceTo.data.rows[0].elements[0].distance.value
        });
     }else{
      return next({
        status:400,
        errorStatus:5,
        message : "missing required params"
       })
     }    
     } catch (error) {
         return next({
             status :500,
             message:error.message
         })
     }
  }

  static async updateUserLocation(req, res,next) {
    try {
      const parsedBody = Object.setPrototypeOf(req.body, {});
      if(parsedBody.hasOwnProperty("lat") && parsedBody.hasOwnProperty("lon") && parsedBody.hasOwnProperty("phoneNumber")){
        let { phoneNumber , lat , lon } = req.body

        let foundUser = await User.findOne({
          phone_number:phoneNumber
        });

        if(foundUser){
          let currentPosition = null
            currentPosition = {  coordinates: [parseFloat(lat)  , parseFloat(lon)] ,  date: Date.now() }
            if(parsedBody.hasOwnProperty("heading")){
              const { heading } = req.body
              currentPosition = {  heading  , coordinates: [parseFloat(lat)  , parseFloat(lon)] ,  date: Date.now() }
            }
            if(parsedBody.hasOwnProperty("adresse")){
              const { adresse } = req.body
              currentPosition = {  adresse , coordinates: [parseFloat(lat)  , parseFloat(lon)] ,  date: Date.now() }
            }
           foundUser.currentPosition = currentPosition
           foundUser.markModified('date');
           await foundUser.save()
           return res.status(200).json({
             status:200,
             message:"updated with success",
           });
        }else{
          return next({
            status:400,
            errorStatus:4,
            message : "Phone Number not found."
          })
        }
      }else{
        return next({
          status:400,
          errorStatus:5,
          message : "missing required params"
        })
      }

  } catch (error) {
      return next({
          status :500,
          message:"Internal Server Error"
      })
  }
}

  static async updateUserProfile(req, res,next) {
    try {
        const parsedBody = Object.setPrototypeOf(req.body, {});
        if(parsedBody.hasOwnProperty("fullName") && parsedBody.hasOwnProperty("email") && parsedBody.hasOwnProperty("phoneNumber") ){
          let { phoneNumber , fullName , email , push_id } = req.body

          let user = await User.findOne({
            phone_number:phoneNumber
          }).select('email phone_number full_name push_id currentPosition');
          if(user){
            user.phone_number = phoneNumber
            user.full_name = fullName
            user.email = email
            if(push_id){
              user.push_id = push_id
            }
           await user.save()
            return res.status(200).json({
              status:200,
              user,
              message:"updated with success",
            });
          }else{
            return next({
              status: 400,
              errorStatus:4,
              message : "Phone Number not found."
            })
          }

        }else{
          return next({
            status:400,
            errorStatus:5,
            message : "missing required params"
           })
        }

    } catch (error) {
        return next({
            status :500,
            message:"Internal Server Error"
        })
    }
  }
}

module.exports = Users;
