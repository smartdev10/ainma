require("dotenv").config();
const db = require("../../models");
const mongoose = require("mongoose");
const {Client} = require("@googlemaps/google-maps-services-js");
const client = new Client({});

const { User } = db;

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

  static async getOneUser(req, res,next) {
    try {
         const {id} = req.params
         if(mongoose.isValidObjectId(id)){
            const user = await User.findById(id , 'email phone_number full_name push_id currentPosition')
            .populate("rates" ,{stars:true , comment:true , hidden:true})
            if(user){
             
              return res.status(200).json(user);
 
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

  static async updateUserProfile(req, res,next) {
    try {
        const parsedBody = Object.setPrototypeOf(req.body, {});
        if(parsedBody.hasOwnProperty("name") && parsedBody.hasOwnProperty("email") && parsedBody.hasOwnProperty("phoneNumber") ){
          let { phoneNumber , name , email  } = req.body

          let user = await User.findOne({ phoneNumber })
          if(user){
            user.phoneNumber = phoneNumber
            user.name = name
            user.email = email
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
