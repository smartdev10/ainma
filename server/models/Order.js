const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./User");
const AutoIncrement = require('mongoose-sequence')(mongoose);
const orderSchema = new Schema({
    number:{
        type:Number,
        required:true,
    },
    items :[
      {
        product : {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required:true
        },
        place: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Place",
          required:true
        },
        quantity :{
          type:Number,
          required:true,
       },
     }
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required:true
    },
    totalPrice:{
      type:Number,
    },
    bank_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bank",
    },
    money_transfer_image: {
      type:String,
    },
    gift_sender: {
      type:String,
    },
    gift_receiver: {
      type:String,
    },
    gift_receiver_phone_number: {
      type:String,
    },
    status:{
      type:String,
      required:true,
      default:'تم استلام الطلب'
    },
},{
  timestamps:true
})

orderSchema.pre("save", async function(next) {
  try {
    // find a user
    let user = await User.findById(this.user);
    // remove the id of the message from their messages list
    user.orders.push(this.id);
    // save that user
    await user.save();
    // return next
    return next();
  } catch (err) {
    return next(err);
  }
});
orderSchema.plugin(AutoIncrement, {inc_field: 'number', disable_hooks: false , start_seq: 1000});
const Order = mongoose.model("Order",orderSchema)
Order.syncIndexes()
module.exports = Order;
