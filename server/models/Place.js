const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const placeSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    type:{
      type:String,
      required:true,
    },
    position: {
      adresse: {type: String} ,
      type: {type: String},
      coordinates : [ Number , Number ] 
    },
},{
  timestamps:true
})


placeSchema.index({ name: 1 }, { unique: true , background: false });

const Place = mongoose.model("Place",placeSchema)
Place.syncIndexes()
module.exports = Place;
