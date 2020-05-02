const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    number:{
        type:String,
        required:true,
    },
    date:{
      type:Date,
      required:true,
    },
    status:{
      type:String,
      required:true,
      default:'Inactif'
    },
},{
  timestamps:true
})


orderSchema.index({ name: 1 }, { unique: true , background: false });

const Order = mongoose.model("Order",orderSchema)
Order.syncIndexes()
module.exports = Order;
