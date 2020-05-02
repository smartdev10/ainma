const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name:{
        type:String,
        required:true,
    }
},{
  timestamps:true
})


productSchema.index({ name: 1 }, { unique: true , background: false });

const Product = mongoose.model("Product",productSchema)
Product.syncIndexes()
module.exports = Product;
