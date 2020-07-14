const {promisifyAll} = require("bluebird");
const redis = require("redis");


promisifyAll(redis.RedisClient.prototype);
promisifyAll(redis.Multi.prototype);


const redisClient = () => {
    return new Promise((resolve, reject) => {
        let connector = redis.createClient({url:"redis://redis-14583.c8.us-east-1-2.ec2.cloud.redislabs.com:14583" , password:"9xnb5tt37EcakCMweRSuova3iPVf6oVI"});
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