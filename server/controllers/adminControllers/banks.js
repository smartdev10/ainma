const db = require("../../models");
const fs = require('fs')
const { Bank } = db;

class Banks {
  static async getBanks(req, res,next) {
    try { 
        const {  range  } = req.query
       if(range){
         let limit = JSON.parse(range)[1];
         let offset = JSON.parse(range)[0]; 
         const banks = await Bank.find({}).limit(limit).skip(offset).sort({_id:-1})
         const total = await Bank.find({}).countDocuments()
         return res.status(200).json({
           banks,
           total
          });
       }else{
        const banks = await Bank.find({}).sort({_id:-1})
        return res.status(200).json(banks);
       }
     } catch (error) {
         return next({
             status :400,
             message:error.message
         })
     }
   }
  static async createBank(req, res,next) {
    try {
         console.log(req.body)
         await Bank.create({...req.body,picture:req.file.filename})
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
   
  static async getOneBank(req, res,next) {
    try {
         const {id} = req.params
         const bank = await Bank.findOne({
           id
         })
         return res.status(200).json(bank);
     } catch (error) {
         return next({
             status :400,
             message:error.message
         })
     }
   }
  static async updateBank(req, res,next) {
    try {
      let { id } = req.params
      const  {file} = req
      if(file){
        let bank = await Bank.findById(id);
        if(bank){ 
          if(fs.existsSync(`${__dirname}/../../../images/banks/${bank.picture}`)){
            fs.unlinkSync(`${__dirname}/../../../images/banks/${bank.picture}`) 
          }
          await Bank.updateOne({
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
        let bank = await Bank.findById(id);
        if(bank){ 
          await Bank.updateOne({
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

  static async deleteBank(req, res,next) {
    try {
      const { filter } = req.query 
      const { id } = JSON.parse(filter);

      let banks = await Bank.find({
        _id: {
          $in:id
        }
      });
      
      for (const bank of banks) {
        if(fs.existsSync(`${__dirname}/../../../images/banks/${bank.picture}`)){
          fs.unlinkSync(`${__dirname}/../../../images/banks/${bank.picture}`) 
        }
      }
    
      await Bank.deleteMany({
        _id: {
          $in:id
        }
       })
      return res.status(200).json({
        messge: 'banks Deleted with success',
      });    
    } catch (error) {
        return next({
            status :400,
            message:error.message
        })
    }
  }
}

module.exports = Banks;
