const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const adminUserSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    username:{
      type:String,
      required:true,
      unique:true
    },
    password:{
      type:String,
      required:true,
    },
    role:{
      type:String,
      required:true
    }   
},{
  timestamps:true
})



adminUserSchema.pre("save",async function (next) {
  try {
      if (!this.isModified("password")) {
        return next();   
      }
      let hashedPassword = await bcrypt.hash(this.password,10);
      this.password = hashedPassword;
      return next();
  } catch (error) {
      return next(error);
  }
})

adminUserSchema.methods.comparePassword = async function (candidatPassword,next) {
  try {
      let isMatch = await bcrypt.compare(candidatPassword,this.password)
      return isMatch;
  } catch (error) {
      return next();
  }
}

const AdminUser = mongoose.model("AdminUser",adminUserSchema)

module.exports = AdminUser;