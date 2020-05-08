require("dotenv").config();
const db = require("../models");
const jwt = require("jsonwebtoken");
const { comfirm2AF } = require('../utils/smsVerify')
const { User } = db;

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_SERVICE_ID
const client = require('twilio')(accountSid, authToken);


class UsersAuth {

  static async signUp(req, res,next) {
    try {
        
        const { phoneNumber , email , name } = req.body
        if(phoneNumber && email && name){

            const userPhone = await User.findOne({ phoneNumber })
            const userEmail = await User.findOne({ email })
            if(userPhone){
                return next({
                    status:400,
                    errorStatus:1,
                    message:"account with phone number already exists"
                }) 
            }else{
                if(userEmail){
                    return next({
                        status:400,
                        errorStatus:2,
                        message:"account with this email already exists"
                    }) 
                }else{
                    client.verify.services(serviceId)
                    .verifications
                    .create({to: phoneNumber, channel: 'sms'})
                    .then(async verification => {
                        const user = await User.create({name,email,phoneNumber})
                        return res.status(200).json({
                            successMessage:"Code sent with success" ,
                            status:200,
                            user,
                            verificationStatus:verification.status,
                            to : verification.to
                        })
                    }).catch(err => {
                        if(err.code === 60200){
                            return next({
                                status:400,
                                errorStatus:3,
                                message:err.message
                            }) 
                        }
                        return next({
                            status:400,
                            message:err.message
                        }) 
                    });
                } 
            }
        }else{
            return next({
                status:400,
                errorStatus:5,
                message:"missing required params"
            }) 
        }
        
        } catch (error) {
            // console.log(error)
            // if(error.code === 11000){
            //     return next({
            //         status:400,
            //         errorStatus:1,
            //         message:"account with phone number already exists"
            //     }) 
            // }else if(error.name === 'ValidationError'){
            //     return next({
            //         status:400,
            //         errorStatus:2,
            //         message:"User validation failed"
            //     }) 
            // }
            return next({
                status : 500,
                message:"Internal Server Error"
            })
        }
   }
   
   static async comfirm(req, res,next){
    try {
        
      const { code , phoneNumber } = req.body
      
        
      if(code && phoneNumber ){
        const user = await User.findOne({
            phoneNumber
        }).select('email phoneNumber name')
        if(user){
            const { id , email , phoneNumber , name } = user;
            let valid = await comfirm2AF(phone_number , code)
             
            if(valid){
                const token = jwt.sign({
                    id,
                    email , 
                    phoneNumber , 
                    name
                },process.env.SECRET_KEY);
                return res.status(200).json({token , user , status:200 , successMessage:"Code Validated with Success"})
            } else {
                return next({
                    status:400,
                    errorStatus:3,
                    message:"Code Is Not Valid."
                })
            }
        }else{
            return next({
                status:400,
                errorStatus:4,
                message : "Phone Number Not Found."
            })
        }
      }else{
        return next({
            status:400,
            errorStatus:5,
            message : "missing required params"
        })
      }
    
    } catch (error) {
        return next({
            status :500,
            message:"Internal Server Error"
        })
    }

   }
   static async signIn(req, res,next) {
        try {  
            const { phoneNumber } = req.body
            if(phoneNumber){
                let user = await User.findOne({
                    phoneNumber
                })
                if(user){
                    const { phoneNumber } = user;
                    await user.save()
                    client.verify.services(serviceId)
                    .verifications
                    .create({to: phoneNumber, channel: 'sms'})
                    .then(verification => {
                        return res.status(200).json({
                            successMessage:"Code sent with success" ,
                            status:200,
                            verificationStatus:verification.status,
                            to : verification.to
                        })
                    }).catch((err)=>{
                        return res.status(500).json({
                            status:400,
                            message : err.message
                        })
                    }); 
               }else{
                return res.status(400).json({
                    status:400,
                    errorStatus:4,
                    message : "Phone Number not found."
                })
               }
            }else {
                return res.status(400).json({
                    status:400,
                    errorStatus:5,
                    message : "missing required params"
                })
            }
           
        }catch(error){
            return next({
                status :500,
                message:"Internal Server Error"
            }) 
        }     
    }
}

module.exports = UsersAuth