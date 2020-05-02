const mongoose = require("mongoose");
const {validateEmail} = require("../utils/validations")
const Schema = mongoose.Schema;


const userSchema = new Schema({
    full_name:{
      type:String,
    },
    email:{
        type:String,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
    },
    push_id:{
      type:String,
    },
    phone_number:{
      type:String,
      required: 'Phone Number is required',
    },
    currentPosition: {
      adresse: {type: String} ,
      heading:{type:Number},
      date :{type:Date},
      coordinates : [ Number , Number ]
    },
    rates: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DriverRate"
      }
    ]
}, {
  timestamps:true
})
userSchema.index({ phone_number: 1 }, { unique: true , background: false });
userSchema.index({ email: 1 }, { unique: true , background: false });

const User = mongoose.model("User",userSchema)
User.syncIndexes()
module.exports = User;