const db = require("../../models");

const { CarCat } = db;

class CarCats {
  static async getCarCats(req, res,next) {
    try { 
        const {  range  } = req.query
        if(range){
          let limit = JSON.parse(range)[1];
          let offset = JSON.parse(range)[0]; 
          const categories = await CarCat.find({}).limit(limit).skip(offset)
          const total = await CarCat.find({}).countDocuments()
         return res.status(200).json({
          categories,
           total
          });
        }else{
          const categories = await CarCat.find({})
        .select('name')
          return res.status(200).json(categories);
        }
     } catch (error) {
         return next({
             status :400,
             message:error.message
         })
     }
   }
  static async createCarCat(req, res,next) {
    try {
         await CarCat.create(req.body)
         return res.status(200).json({
          status:200,
          message : "saved with success"
      });
     } catch (error) {
         return next({
             status :500,
             message:error.message
         })
     }
   }
   
  static async getOneCarCat(req, res,next) {
    try {
         const {id} = req.body
         const category = await CarCat.findOne({
           id
         })
         return res.status(200).json(category);
     } catch (error) {
         return next({
             status :500,
             message:error.message
         })
     }
   }
  static async updateCarCat(req, res,next) {
    try {
        const parsedBody = Object.setPrototypeOf(req.body, {});
        if(parsedBody.hasOwnProperty("name")){
          let { name } = req.body
          let { id } = req.params
          
          let doc = await CarCat.findById(id);
          if(doc){
            await CarCat.updateOne({
                _id: id
            },{ name });
            return res.status(200).json({
              status:200,
              message:"updated with success",
            });
          }else{
            return res.status(400).json({
              status: 4,
              message : "Category not found."
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

  static async deleteCarCat(req, res,next) {
    try {
      const { filter } = req.query 
      const { id } = JSON.parse(filter);
  
      await CarCat.deleteMany({
        _id: {
          $in:id
        }
       })
      return res.status(200).json({
        messge: 'Categoies Deleted with success'
      });    
    } catch (error) {
        return next({
            status :400,
            message:error.message
        })
    }
  }
}

module.exports = CarCats;
