const db = require("../../models");
const mongoose = require("mongoose");
const isDataUri = require('validator/lib/isDataURI')
const mime = require('mime');
const fs = require('fs');
const dataUriToBuffer = require('data-uri-to-buffer');
const { Order , User } = db;

class Orders {
  static async getOrders(req, res,next) {
    try { 
        const {  range  } = req.query
        if(range){
          let limit = JSON.parse(range)[1];
          let offset = JSON.parse(range)[0]; 
          const orders = await Order.find({}).limit(limit).skip(offset).sort({_id:-1})
          .populate("user")
          .populate('bank_id')
          .populate({
            path: 'items.product',
          })
          .populate({
            path: 'items.place',
          })
          const total = await Order.find({}).countDocuments()
          return res.status(200).json({
            orders,
            total
            });
        }else{
          const orders = await Order.find({}).sort({_id:-1})
          .populate("user")
          .populate('bank_id')
          .populate({
            path: 'items.product',
          })
          .populate({
            path: 'items.place',
          })
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
         const {user , money_transfer_image , items} = req.body
         if(mongoose.isValidObjectId(user) && isDataUri(money_transfer_image)){
          let foundUser = await User.findOne({_id:user})
          let check = items.every(item => mongoose.isValidObjectId(item.product) && mongoose.isValidObjectId(item.place))
          if(check){
            if(foundUser){
              var decodedImg = dataUriToBuffer(money_transfer_image);
              let raw = new Buffer.from(decodedImg, 'base64');
              let type = decodedImg.type;
              let extension = mime.getExtension(type);
              let fileName = `image_${foundUser.name}_receipt.` + extension
              fs.writeFileSync("./images/receipts/" + fileName, raw, 'utf8');
              const order = await Order.create({...req.body,money_transfer_image:fileName})
              return res.status(200).json({
               status:200,
               message : "saved with success"
              });
            }else{
              return next({
                status :400,
                errorStatus:3,
                message:"user not found"
               })
            }
          }
          else{
            return next({
              status :400,
              errorStatus:1,
              message:"invalid items ids"
             })
          }
         }else{
           return next({
            status :400,
            errorStatus:5,
            message:"invalid data"
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
