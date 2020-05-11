const {promisifyAll} = require("bluebird");
const redis = require("redis");


promisifyAll(redis.RedisClient.prototype);
promisifyAll(redis.Multi.prototype);


const redisClient = () => {
    return new Promise((resolve, reject) => {
        let connector = redis.createClient({host:'54.88.189.39', port:6379});
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