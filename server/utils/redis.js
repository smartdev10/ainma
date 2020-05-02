const {promisifyAll} = require("bluebird");
const redis = require("redis");


promisifyAll(redis.RedisClient.prototype);
promisifyAll(redis.Multi.prototype);


const redisClient = () => {
    return new Promise((resolve, reject) => {
        let connector = redis.createClient({url:"redis://redis-14117.c91.us-east-1-3.ec2.cloud.redislabs.com:14117" , password:process.env.REDIS_PASS});
        connector.on("error", () => {
            reject("Redis Connection failed");
        });

        connector.on("connect", () => {
            resolve(connector);
        });
    });
};


const setToken = (id, token) => {
    return new Promise((resolve, reject) => {
        redisClient().then((redisres)=>{
          redisres.set(id,token , (err,reply)=>{
              if(err || !reply){
                  return reject(err)
              }
              return resolve(reply)
          })
      }).catch((err)=>{
        return reject(err)
      })
   });
 }

 const getToken = (id) => {
      return new Promise((resolve, reject) => {
        redisClient().then((redisres)=>{
          redisres.get(id,(err,reply)=>{
                  if(err || !reply){
                      return reject('Unauthorized')
                  }
                  return resolve(reply)
              })
          }).catch((err)=>{
            return reject(err)
          })
      })
  }

  exports.redisClient = redisClient
  exports.setToken = setToken
  exports.getToken = getToken