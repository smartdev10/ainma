const db = require("../../models");

const { Message } = db;

class Messages {
  static async getMessages(req, res,next) {
    try { 
        const {  range  } = req.query
        if(range){
          let limit = JSON.parse(range)[1];
          let offset = JSON.parse(range)[0]; 
          const messages = await Message.find({}).limit(limit).skip(offset)
          const total = await Message.find({}).countDocuments()
          return res.status(200).json({
            messages,
            total
            });
        }else{
          const messages = await Message.find({})
          return res.status(200).json(messages);
        }
     } catch (error) {
         return next({
             status :400,
             message:error.message
         })
     }
  }
  static async createMessage(req, res,next) {
    try {
         await Message.create(req.body)
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
   
  static async getOneMessage(req, res,next) {
    try {
         const {id} = req.body
         const message = await Message.findOne({ id })
         return res.status(200).json(message);
     } catch (error) {
         return next({
             status :400,
             message:error.message
         })
     }
  }
  static async deleteMessage(req, res,next) {
    try {
        const { filter } = req.query 
        const { id } = JSON.parse(filter);
        const message = await Message.deleteMany({
          _id: {
            $in:id
          }
        })
        return res.status(200).json(message);
     } catch (error) {
         return next({
             status :400,
             message:error.message
         })
     }
   }
}

module.exports = Messages;
