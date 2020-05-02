const db = require("../../models");

const { Place } = db;

class Places {
  static async getPlaces(req, res,next) {
    try { 
        const {  range  } = req.query
        if(range){
          let limit = JSON.parse(range)[1];
          let offset = JSON.parse(range)[0]; 
          const places = await Place.find({}).limit(limit).skip(offset)
          const total = await Place.find({}).countDocuments()
          return res.status(200).json({
           places,
           total
          });
        }else{
          const places = await Place.find({})
        .select('name')
          return res.status(200).json(places);
        }
     } catch (error) {
         return next({
             status :400,
             message:error.message
         })
     }
   }
  static async createPlace(req, res,next) {
    try {
         await Place.create(req.body)
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
   
  static async getOnePlace(req, res,next) {
    try {
         const {id} = req.body
         const place = await Place.findOne({
           id
         })
         return res.status(200).json(place);
     } catch (error) {
         return next({
             status :500,
             message:error.message
         })
     }
   }
  static async updatePlace(req, res,next) {
    try {
        const parsedBody = Object.setPrototypeOf(req.body, {});
        if(parsedBody.hasOwnProperty("name")){
          let { name } = req.body
          let { id } = req.params
          
          let place = await Place.findById(id);
          if(place){
            await Place.updateOne({
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

  static async deletePlace(req, res,next) {
    try {
      const { filter } = req.query 
      const { id } = JSON.parse(filter);
  
      await Place.deleteMany({
        _id: {
          $in:id
        }
       })
      return res.status(200).json({
        messge: 'places deleted with success'
      });    
    } catch (error) {
        return next({
            status :400,
            message:error.message
        })
    }
  }
}

module.exports = Places;
