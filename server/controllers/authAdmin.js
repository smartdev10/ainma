require("dotenv").config();
const db = require("../models");
const jwt = require("jsonwebtoken");
const {redisClient , setToken} = require('../utils/redis')
const { AdminUser } = db;




class AdminUsersAuth {

  static async signUp(req, res,next) {
    try {
        await AdminUser.create(req.body)
        return res.status(200).json({
            message : "Registered with success"
        });
        } catch (error) {
            return next({
                status :error.status,
                message:error.message
            })
        }
   }

   static async logout (req,res,next) {
        try {
            redisClient().then((redisres)=>{
                redisres.del(req.body.userId,function(err, o) {
                    if(err || !o){
                        res.clearCookie('ainma_access');
                        res.clearCookie('ainma_jid');
                        return res.status(200).json({
                            status:200,
                            message:"you are logged out !"
                        });
                    }
                    res.clearCookie('rider_access');
                    res.clearCookie('jid');
                    return res.status(200).json({
                        status:200,
                        message:"you are logged out !"
                    });
                })
            }).catch((err)=>{
                return next({
                    status:400,
                    errorStatus:800,
                    message:"error connecting to redis"
                });
            })

        } catch (error) {
            return next({
                status:500,
                errorStatus:503,
                message:"Internal Server Error"
            })
        }
   }


   static async signIn(req, res,next) {
        try {
            let user = await AdminUser.findOne({
                username:req.body.username
            })

            let { id, username , email , role } = user;
            let isMatch = await user.comparePassword(req.body.password);
            if(user){
              if(isMatch){
                  let token = jwt.sign({
                      id,
                      username,
                      email,
                      role
                  },process.env.SECRET_KEY , {expiresIn:"30m"});

                  setToken(id,token).then(()=>{
                      const accessToken = token.split(".").slice(0, 2).join('.')
                      const jid = token.split(".").pop()
                      let date = new Date();
                      date.setTime(date.getTime() + (60 * 1000));
                      res.cookie('ainma_access',accessToken ,{
                          expires:false ,
                      })
                      res.cookie('ainma_jid',jid ,{
                          httpOnly:true,
                          expires:false
                      })
                      return res.status(200).json({successMessage:"success"})
                  }).catch((err)=>{
                      return next({
                          status:400,
                          message:"error connecting to redis"
                      })
                  })

              } else{
                  return next({
                      status:401,
                      message:"Invalid Password"
                  })
              }
            }else{
              return next({
                  status:401,
                  message:"Invalid UserName"
              })
            }

        }catch(error){
            return next({
                status:500,
                message:"Internal Server Error"
            })
        }
    }


    static async refreshToken(req, res,next) {
        try {
            let user = await AdminUser.findOne({
                 id:req.body.userId
            })

        if(user){
               let { id, username , email , role } = user;
               let token = jwt.sign({
                    id,
                    username,
                    email,
                    role
                },process.env.SECRET_KEY , {expiresIn:"1m"});

            redisClient().then((redisRes)=>{
                redisRes.del(req.body.userId,function(err, o) {
                    if(err){
                        return next({
                            status:401,
                            message:"mmmm Something went wrong"
                        })
                    }

                    setToken(id,token).then(()=>{
                        const accessToken = token.split(".").slice(0, 2).join('.')
                        const jid = token.split(".").pop()
                        let date = new Date();
                        date.setTime(date.getTime() + (60 * 3000));
                        res.cookie('ainma_access',accessToken,{
                            expires:false
                        })
                        res.cookie('ainma_jid',jid ,{
                            httpOnly:true,
                            expires:false,
                        })
                        return res.status(200).json({RefreshSuccessMessage:"Refresh set with success"})
                    }).catch((err)=>{
                        return next({
                            status:400,
                            message:err.message
                        })
                    })
                })
            }).catch((err)=>{
                return res.status(200).json({
                    status:400,
                    message:"error connecting to redis"
                });
            })

        } else{
            return next({
                status:400,
                message:"Invalid User"
            })
        }
    } catch (error) {
        return next({
            status:500,
            message:"opss something is wrong"
        })
    }
 }
}

module.exports = AdminUsersAuth
