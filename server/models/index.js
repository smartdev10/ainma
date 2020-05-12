require("dotenv").config();
const mongoose = require("mongoose");
mongoose.set("debug",false)
mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.DEV_MONGO_URI,{
    auth:{
      "authSource":"admin"
    },
    user:process.env.MONGO_USER,
    pass:process.env.MONGO_PASS,
    keepAlive:true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex:true,
})
.then(()=>{
  console.log("connected to mongodb")
}).catch((err)=>{
   console.log(err.message)
})
module.exports.User = require("./User");
module.exports.Page = require("./Page");
module.exports.Image = require("./image");
module.exports.AdminUser = require("./AdminUser");
module.exports.Product = require("./Product");
module.exports.Place = require("./Place");
module.exports.Order = require("./Order");
module.exports.Message = require("./Message");
module.exports.Bank = require("./Bank");