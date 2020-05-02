require("dotenv").config();
const mongoose = require("mongoose");
mongoose.set("debug",false)
mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.MONGO_URI,{
    keepAlive:true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex:true,
})
.then(async ()=>{
  console.log("connected to mongodb")
}).catch((err)=>{
   console.log(err.message)
})
module.exports.User = require("./User");
module.exports.Product = require("./Product");
module.exports.Place = require("./Place");
module.exports.Order = require("./Order");