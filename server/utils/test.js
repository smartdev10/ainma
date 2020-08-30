const {promisifyAll} = require("bluebird");
const redis = require("redis");
const fs = require("fs");


promisifyAll(redis.RedisClient.prototype);
promisifyAll(redis.Multi.prototype);

const tls_options = {
    ca:fs.readFileSync('local.pem')
};
const redisClient = () => {
    return new Promise((resolve, reject) => {
        let connector = redis.createClient({url:"rediss://abdeljalil-8542:RiTn8Bf6XSV-aVu9s4Zk@abdeljalil-8542.redis.dbs.scalingo.com:33455" ,tls:tls_options});
        connector.on("error", (err) => {
            console.log(err)
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