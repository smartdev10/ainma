require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_SERVICE_ID

const client = require('twilio')(accountSid, authToken);


exports.comfirm2AF = (to  , code) => {
    return new Promise((resolve, reject) => {
      client.verify.services(serviceId)
      .verificationChecks
      .create({to , code})
      .then(verification_check => {
          if(verification_check.valid) {
              resolve(true)
          }else {
              resolve(false)
          }
      }).catch((reason)=>{
          reject(reason)
      });
    });
};
