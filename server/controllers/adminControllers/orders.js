const db = require("../../models");

const { Order } = db;

class Orders {
  static async getOrders(req, res,next) {
    try { 
        const {  range  } = req.query
        if(range){
          let limit = JSON.parse(range)[1];
          let offset = JSON.parse(range)[0]; 
          const documents = await Order.find({}).limit(limit).skip(offset)
          const total = await Order.find({}).countDocuments()
          return res.status(200).json({
            documents,
            total
            });
        }else{
          const pages = await Order.find({})
          return res.status(200).json({
            pages,
           });
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
         await Order.create(req.body)
         return res.status(200).json({
          status:200,
          message : "saved with success"
      });
     } catch (error) {
         return next({
             status :400,
             message:error.message
         })
     }
   }
   
  static async getOneOrder(req, res,next) {
    try {
         const {id} = req.body
         const doc = await Order.findOne({
           id
         })
         return res.status(200).json(doc);
     } catch (error) {
         return next({
             status :400,
             message:error.message
         })
     }
   }

   static async deleteOrder(req, res,next) {
    try {
        const { filter } = req.query 
        const { id } = JSON.parse(filter);
         const doc = await Order.deleteMany({
          _id: {
            $in:id
          }
         })
         console.log(doc)
         return res.status(200).json(doc);
     } catch (error) {
         return next({
             status :400,
             message:error.message
         })
     }
   }
  static async updateOrder(req, res,next) {
    try {
        const parsedBody = Object.setPrototypeOf(req.body, {});
        if(parsedBody.hasOwnProperty("body") && parsedBody.hasOwnProperty("document")){
          let { body , document } = req.body
          let { id } = req.params
          
          let doc = await Order.findById(id);
          if(doc){
            let updated =  await Order.updateOne({
                _id: id
            },{ body , document});
            return res.status(200).json({
              status:200,
              message:"updated with success",
            });
          }else{
            return res.status(400).json({
              status: 4,
              message : "Document not found."
            })
          }

        }else{
          return res.status(400).json({
            status:5,
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

module.exports = Orders;
