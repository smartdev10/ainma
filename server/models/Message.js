const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    phoneNumber:{
      type:String,
      required:true,
    },
    message: {
      type: String,
      required:true,
    }
},{
  timestamps:true
})



const Message = mongoose.model("Message",messageSchema)
Message.syncIndexes()
module.exports = Message;
