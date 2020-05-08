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
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required:true
    },
    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Place",
      required:true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required:true
    },
    quantity:{
      type:Number,
      required:true,
    },
    totalPrice:{
      type:Number,
      required:true,
    },
    money_transfer_image: {
      type:String,
      required:true
    },
    gift_sender: {
      type:String,
    },
    gift_receiver: {
      type:String,
    },
    gift_receiver_number: {
      type:String,
    },
    status:{
      type:String,
      required:true,
      default:'Inactif'
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
const Order = mongoose.model("Order",orderSchema)
Order.syncIndexes()
module.exports = Order;
