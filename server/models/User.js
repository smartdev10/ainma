const mongoose = require("mongoose");
const {validateEmail} = require("../utils/validations")
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
      type:String,
    },
    email:{
        type:String,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
    },
    phoneNumber:{
      type:String,
      required: 'Phone Number is required',
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
      }
    ]
}, {
  timestamps:true
})
userSchema.index({ phoneNumber: 1 }, { unique: true , background: false });
userSchema.index({ email: 1 }, { unique: true , background: false });

const User = mongoose.model("User",userSchema)
User.syncIndexes()
module.exports = User;