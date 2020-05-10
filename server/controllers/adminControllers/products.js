const db = require("../../models");
const fs = require('fs')
const { Product } = db;

class Products {
  static async getproducts(req, res,next) {
    try { 
        const {  range  } = req.query
       if(range){
         let limit = JSON.parse(range)[1];
         let offset = JSON.parse(range)[0]; 
         const products = await Product.find({}).limit(limit).skip(offset)
         const total = await Product.find({}).countDocuments()
         return res.status(200).json({
           products,
           total
          });
       }else{
        const products = await Product.find({})
        return res.status(200).json(products);
       }
     } catch (error) {
         return next({
             status :400,
             message:error.message
         })
     }
   }
  static async createProduct(req, res,next) {
    try {
         console.log(req.body)
         await Product.create({...req.body,picture:req.file.filename})
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
   
  static async getOneProduct(req, res,next) {
    try {
         const {id} = req.params
         const product = await Product.findOne({
           id
         })
         return res.status(200).json(product);
     } catch (error) {
         return next({
             status :400,
             message:error.message
         })
     }
   }
  static async updateProduct(req, res,next) {
    try {
      let { id } = req.params
      const  {file} = req
      if(file){
        let product = await Product.findById(id);
        if(product){ 
          if(fs.existsSync(`${__dirname}/../../../images/produits/${product.picture}`)){
            fs.unlinkSync(`${__dirname}/../../../images/produits/${product.picture}`) 
          }
          await Product.updateOne({
              _id: id
          },{...req.body,picture:req.file.filename});
          return res.status(200).json({
            status:200,
            message:"updated with success",
          });
        }else{
          return res.status(400).json({
            status: 4,
            message : "product not found."
          })
        }
      }else {
        let product = await Product.findById(id);
        if(product){ 
          await Product.updateOne({
              _id: id
          },req.body);
          return res.status(200).json({
            status:200,
            message:"updated with success",
          });
        }else{
          return res.status(400).json({
            status: 4,
            message : "product not found."
          })
        }
      }
    } catch (error) {
      console.log(error)
        return next({
            status :500,
            message:"Internal Server Error"
        })
    }
  }

  static async deleteProduct(req, res,next) {
    try {
      const { filter } = req.query 
      const { id } = JSON.parse(filter);

      let products = await Product.find({
        _id: {
          $in:id
        }
      });
      
      for (const product of products) {
        if(fs.existsSync(`${__dirname}/../../../images/produits/${product.picture}`)){
          fs.unlinkSync(`${__dirname}/../../../images/produits/${product.picture}`) 
        }
      }
    
      await Product.deleteMany({
        _id: {
          $in:id
        }
       })
      return res.status(200).json({
        messge: 'products Deleted with success',
      });    
    } catch (error) {
        return next({
            status :400,
            message:error.message
        })
    }
  }
}

module.exports = Products;
