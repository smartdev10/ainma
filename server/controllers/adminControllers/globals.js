const db = require("../../models");
const mongoose = require("mongoose");
const { Global } = db;

class Globals {
  static async getGlobals(req, res,next) {
    try { 
        const {  range  } = req.query
        let limit = JSON.parse(range)[1];
        let offset = JSON.parse(range)[0]; 
         const globals = await Global.find({}).limit(limit).skip(offset)
         const total = await Global.find({}).countDocuments()
         return res.status(200).json({
           globals,
           total
          });
     } catch (error) {
         return next({
             status :400,
             message:error.message
         })
     }
   }
  static async createGlobals(req, res,next) {
    try {
         await Global.create(req.body)
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
   
  static async getOneGlobal(req, res,next) {
    try {
         const {id} = req.body
         const doc = await Global.findOne({
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

   static async deleteGlobal(req, res,next) {
    try {
        const { filter } = req.query 
        const { id } = JSON.parse(filter);
         const doc = await Global.deleteMany({
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
  static async updateGlobal(req, res,next) {
    try {
        let { id } = req.params
        if(mongoose.isValidObjectId(id)){
          const doc = await Global.updateOne({ _id:id },req.body)
          if(doc.nModified === 0){
            return next({
              status :400,
              errorStatus:15,
              message:'Did not Updated Promo'
             })
           }else{
            return res.status(200).json({
              status:200,
              message:`updated ${doc.nModified} Drivers`
            });
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

module.exports = Globals;
