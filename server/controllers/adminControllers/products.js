const db = require("../../models");

const { CarCompany } = db;

class CarCompanies {
  static async getCarCompanies(req, res,next) {
    try { 
        const {  range  } = req.query
       if(range){
         let limit = JSON.parse(range)[1];
         let offset = JSON.parse(range)[0]; 
         const carcompanies = await CarCompany.find({}).limit(limit).skip(offset)
         const total = await CarCompany.find({}).countDocuments()
         return res.status(200).json({
           carcompanies,
           total
          });
       }else{
        const carcompanies = await CarCompany.find({})
        .select('name')
        return res.status(200).json(carcompanies);
       }
     } catch (error) {
         return next({
             status :400,
             message:error.message
         })
     }
   }
  static async createCarCompany(req, res,next) {
    try {
         await CarCompany.create(req.body)
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
   
  static async getOneCarCompany(req, res,next) {
    try {
         const {id} = req.body
         const doc = await CarCompany.findOne({
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
  static async updateCarCompany(req, res,next) {
    try {
        const parsedBody = Object.setPrototypeOf(req.body, {});
        if(parsedBody.hasOwnProperty("name")){
          let { name } = req.body
          let { id } = req.params
          
          let doc = await CarCompany.findById(id);
          if(doc){ 
            await CarCompany.updateOne({
                _id: id
            },{ name });
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

  static async deleteCarCompany(req, res,next) {
    try {
      const { filter } = req.query 
      const { id } = JSON.parse(filter);
      await CarCompany.deleteMany({
        _id: {
          $in:id
        }
       })
      return res.status(200).json({
        messge: 'Categoies Deleted with success',
      });    
    } catch (error) {
        return next({
            status :400,
            message:error.message
        })
    }
  }
}

module.exports = CarCompanies;
