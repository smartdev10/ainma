const db = require("../../models");

const { Document } = db;

class Documents {
  static async getDocuments(req, res,next) {
    try { 
        const {  range  } = req.query
        if(range){
          let limit = JSON.parse(range)[1];
          let offset = JSON.parse(range)[0]; 
          const documents = await Document.find({}).limit(limit).skip(offset)
          const total = await Document.find({}).countDocuments()
          return res.status(200).json({
            documents,
            total
            });
        }else{
          const pages = await Document.find({})
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
  static async createDocuments(req, res,next) {
    try {
         await Document.create(req.body)
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
   
  static async getOneDocument(req, res,next) {
    try {
         const {id} = req.body
         const doc = await Document.findOne({
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

   static async deleteDocuments(req, res,next) {
    try {
        const { filter } = req.query 
        const { id } = JSON.parse(filter);
         const doc = await Document.deleteMany({
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
  static async updateDocument(req, res,next) {
    try {
        const parsedBody = Object.setPrototypeOf(req.body, {});
        if(parsedBody.hasOwnProperty("body") && parsedBody.hasOwnProperty("document")){
          let { body , document } = req.body
          let { id } = req.params
          
          let doc = await Document.findById(id);
          if(doc){
            let updated =  await Document.updateOne({
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

module.exports = Documents;
