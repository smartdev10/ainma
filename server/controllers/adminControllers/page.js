const db = require("../../models");

const { Page , Image} = db;

class Pages {
  static async getPages(req, res,next) {
    try { 
        const {  range  } = req.query
        if(range){
          let limit = JSON.parse(range)[1];
          let offset = JSON.parse(range)[0]; 
          const pages = await Page.find({}).limit(limit).skip(offset)
          const total = await Page.find({}).countDocuments()
          return res.status(200).json({
            pages,
            total
            });
        }else{
          const pages = await Page.find({})
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
  static async createPage(req, res,next) {
    try {
         await Page.create(req.body)
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
   
  static async getOnePage(req, res,next) {
    try {
         const {id} = req.params
         const doc = await Page.findOne({ id })
         return res.status(200).json(doc);
     } catch (error) {
         return next({
             status :400,
             message:error.message
         })
     }
   }

   static async deletePage(req, res,next) {
    try {
        const { filter } = req.query 
        const { id } = JSON.parse(filter);
         const page = await Page.deleteMany({
          _id: {
            $in:id
          }
         })
         return res.status(200).json(page);
     } catch (error) {
         return next({
             status :400,
             message:error.message
         })
     }
   }
  static async updatePage(req, res,next) {
    try {
        const parsedBody = Object.setPrototypeOf(req.body, {});
        if(parsedBody.hasOwnProperty("body") && parsedBody.hasOwnProperty("page")){
          let { body , page } = req.body
          let { id } = req.params
          
          let doc = await Page.findById(id);
          if(doc){
            await Page.updateOne({
                _id: id
            },{ body , page});
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

module.exports = Pages;
