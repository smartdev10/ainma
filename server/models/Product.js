const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    price:{
      type:Number,
      required:true,
    },
    picture:{
      type:String,
      required:true,
    },
    description:{
      type:String,
      required:true,
    }
},{
  timestamps:true
})

const Product = mongoose.model("Product",productSchema)
Product.syncIndexes()
module.exports = Product;
