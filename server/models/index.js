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
  // await require("./User").deleteMany({})
  // await require("./DriverNotification").deleteMany({})
  // await require("./UserNotification").deleteMany({})
  // await require("./Driver").deleteMany({})
  // await require("./Image").deleteMany({})
  // await require("./Ride").deleteMany({})
  // await require("./DriverRate").deleteMany({})
  // await require("./UserRate").deleteMany({})
  // await require("./Driver").updateMany({} ,{rates:[] ,  rides:[]})
  // await require("./User").updateMany({} ,{rates:[] , rides:[]})
  console.log("connected to mongodb")
}).catch((err)=>{
   console.log(err.message)
})
module.exports.User = require("./User");
module.exports.Product = require("./Product");
module.exports.Place = require("./Place");
module.exports.Order = require("./Order");