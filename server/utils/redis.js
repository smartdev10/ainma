const {promisifyAll} = require("bluebird");
const redis = require("redis");


promisifyAll(redis.RedisClient.prototype);
promisifyAll(redis.Multi.prototype);


const redisClient = () => {
    return new Promise((resolve, reject) => {
        let connector = redis.createClient({url:"redis://:RiTn8Bf6XSV-aVu9s4Zk@abdeljalil-8542.redis.dbs.scalingo.com:33455"});
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