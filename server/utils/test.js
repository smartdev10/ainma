const {promisifyAll} = require("bluebird");
const redis = require("redis");


promisifyAll(redis.RedisClient.prototype);
promisifyAll(redis.Multi.prototype);


const redisClient = () => {
    return new Promise((resolve, reject) => {
        let connector = redis.createClient({url:"redis://ainma.m7vfg9.ng.0001.use1.cache.amazonaws.com:6379"});
        connector.on("error", () => {
            reject("Redis Connection failed");
        });

        connector.on("connect", () => {
            resolve(connector);
        });
    });
};


redisClient().then(res=>{
    console.log("done")
}).catch((err)=>{
  console.log(err)
})