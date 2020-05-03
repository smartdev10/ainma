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


messageSchema.index({ name: 1 }, { unique: true , background: false });

const Message = mongoose.model("Message",messageSchema)
Message.syncIndexes()
module.exports = Message;
