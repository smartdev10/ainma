require("dotenv").config();
const redis = require("redis");

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;

// const client = require('twilio')(accountSid, authToken);

// // client.verify.services('VA2cab7a67a25f1bf8e5e3c289e6e1a2fa')
// //              .verifications
// //              .create({to: '+212604389933', channel: 'sms'})
// //              .then(verification => console.log(verification.sid));

// client.verify.services('VA2cab7a67a25f1bf8e5e3c289e6e1a2fa')
//       .verificationChecks
//       .create({to: '+212604389933', code: '9346'})
//       .then(verification_check => console.log(verification_check.valid));

const redisClient = () => {
      return new Promise((resolve, reject) => {
          let connector = redis.createClient({url:"redis://redis-14117.c91.us-east-1-3.ec2.cloud.redislabs.com:14117" , password:"nt8vxvZrtTT9TNQ3D6kVTRSanZo6qUeJ"});
          connector.on("error", () => {
              reject("Redis Connection failed");
          });
  
          connector.on("connect", () => {
              resolve(connector);
          });
      });
  };

  redisClient().then(()=>{
        console.log("connected")
  }).catch((err)=>{
      console.log(err)
  })