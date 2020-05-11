require("dotenv").config();
const db = require("../../models");
const mongoose = require("mongoose");

const { User , Order } = db;

class Users {
  static async getListUsers(req, res,next) {
   try {
        const { range } = req.query
        if(range){
          let limit = JSON.parse(range)[1];
          let offset = JSON.parse(range)[0]; 
          const users = await User.find({}).limit(limit).skip(offset)
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

  static async getUserOrders(req, res,next) {
    try {
         const {id} = req.params
         const userOrders = await Order.find({ user:id })
         .populate({
          path: 'items.product',
          })
          .populate({
            path: 'items.place',
          })
         return res.status(200).json({
           orders:userOrders
         });
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
         if(mongoose.isValidObjectId(id)) {
          const user = await User.findById(id).populate("orders")
          return res.status(200).json(user);
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
         let { phoneNumber , name , email  } = req.body
         const { id } = req.params
         if(mongoose.isValidObjectId(id)){
            let user = await User.findById(id)
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
         }
    } catch (error) {
        return next({
            status :500,
            message:"Internal Server Error"
        })
    }
  }
  static async deleteAll(req, res,next) {
    try {
        
         await User.deleteMany({})
         return res.status(200).json("deleted all");
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

}

module.exports = Users;
