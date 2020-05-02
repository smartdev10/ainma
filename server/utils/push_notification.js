require("dotenv").config();
const OneSignal = require('onesignal-node'); 

const DriverClient = new OneSignal.Client(process.env.RIDER_DRIVER_ID, process.env.RIDER_DRIVER_KEY);
const client = new OneSignal.Client(process.env.RIDER_ID, process.env.RIDER_KEY);


exports.DriverClient = DriverClient
exports.client = client
