require("dotenv").config();
const jwt = require("jsonwebtoken");
const {getToken} = require('../utils/redis')

exports.loginRequired = function(req,res,next){
    try {
        const accessToken = req.cookies.access
        const jid = req.cookies.jid
        jwt.verify(`${accessToken}.${jid}`,process.env.SECRET_KEY,function(err,decoded){
            if(err){
                return next({
                    status: 401,
                    message:err.message
                })
            }
            if(decoded){
                getToken(decoded.id).then((res)=>{
                    return next();
                }).catch((err)=>{
                    return next({
                        status: 401,
                        message:"Unauthorized"
                    })
                })
                
            }else{
                return next({
                    status: 401,
                    message:err.message
                })
            }
           
         })
    } catch (error) {
        return next({
            status: 401,
            message:"Unauthorized"
        })
    }

}


exports.ensureCorrectUser = function(req,res,next){
    try {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token,process.env.SECRET_KEY,function(err,decoded){
            if(decoded && decoded.id === req.params.id){
                return next()
            }else{
                return next({
                    status:401,
                    message:"Unauthorized"
                })
            }
        })
    } catch (error) {
        return next({
            status:401,
            message:"Unauthorized"
        })
    }
}