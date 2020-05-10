const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bankSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    accountNumber:{
      type:Number,
      required:true,
    },
    iban:{
      type:String,
      required:true,
    },
    picture:{
      type:String,
      required:true,
    }
},{
  timestamps:true
})

const Bank = mongoose.model("Bank",bankSchema)
Bank.syncIndexes()
module.exports = Bank;
