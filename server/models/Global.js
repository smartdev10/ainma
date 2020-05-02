const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const globalParamSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    value:{
      type:String,
      required:true,
    },
},{
  timestamps:true
})


globalParamSchema.index({ name: 1 }, { unique: true , background: false });

const Global = mongoose.model("Global",globalParamSchema)
Global.syncIndexes()
module.exports = Global;
