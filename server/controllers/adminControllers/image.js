const db = require("../../models");

const { Image } = db;

class Images {
    static async getOneImage(req, res,next) {
        try {
             const {name} = req.params
             const image = await Image.findOne({}).limit(1).sort({$natural:-1})
             return res.status(200).json(image);
         } catch (error) {
             return next({
                 status :400,
                 message:error.message
             })
         }
       }

       static async UploadImage(req, res,next) {
        try {
            const image = await Image.findOne({name:req.file.filename})
            if(image){
              image.name=req.file.filename
              await image.save()
              return res.status(200).json({
                status:200,
                message : "saved with success"
              });
            }else{
              await Image.create({name:req.file.filename})
              return res.status(200).json({
                status:200,
                message : "saved with success"
              });
            }
          } catch (error) {
              return next({
                  status :400,
                  message:error.message
              })
          }
       }
}
module.exports = Images;
