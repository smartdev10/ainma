const db = require("../../models");
const mongoose = require("mongoose");

const { Order } = db;

class Orders {
  static async getOrders(req, res,next) {
    try { 
        const {  range  } = req.query
        if(range){
          let limit = JSON.parse(range)[1];
          let offset = JSON.parse(range)[0]; 
          const orders = await Order.find({}).limit(limit).skip(offset)
          const total = await Order.find({}).countDocuments()
          return res.status(200).json({
            orders,
            total
            });
        }else{
          const orders = await Order.find({})
          return res.status(200).json(orders);
        }
     } catch (error) {
         return next({
             status :400,
             message:error.message
         })
     }
   }
  static async createOrder(req, res,next) {
    try {
         const {userid} = req.body
         if(mongoose.isValidObjectId(userid)){
          await Order.create(req.body)
          return res.status(200).json({
           status:200,
           message : "saved with success"
          });
         }else{
           return next({
            status :400,
            errorStatus:3,
            message:error.message
           })
         }
     } catch (error) {
         return next({
             status :400,
             message:error.message
         })
     }
   }
  static async getOneOrder(req, res,next) {
    try {
         const {id} = req.params
         const order = await Order.findOne({ id })
         return res.status(200).json(order);
     } catch (error) {
         return next({
             status :400,
             message:error.message
         })
     }
   }
  static async updateOrder(req, res,next) {
    try {
          let { id } = req.params
          let order = await Order.findById(id);
          if(order){
             await Order.updateOne({
                _id: id
             },req.body);
            return res.status(200).json({
              status:200,
              message:"updated with success",
            });
          }else{
            return next({
              status:400,
              errorStatus:7,
              message : "order not found"
             })
          }
    } catch (error) {
        return next({
            status :500,
            message:"Internal Server Error"
        })
    }
  }
  static async deleteOrder(req, res,next) {
    try {
        const { filter } = req.query 
        const { id } = JSON.parse(filter);
        const order = await Order.deleteMany({
          _id: {
            $in:id
          }
        })
        return res.status(200).json(order);
     } catch (error) {
         return next({
             status :400,
             message:error.message
         })
     }
   }
}

module.exports = Orders;
