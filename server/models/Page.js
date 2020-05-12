const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pageSchema = new Schema({
    page:{
        type:String,
        required:true
    },
    body:{
      type:String,
      required:true
    }
}, {
  timestamps:true
})

const Page = mongoose.model("Page",pageSchema)
module.exports = Page;