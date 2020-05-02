'use strict';

const express = require("express");
const http = require('http');
const {Emmitter} = require('./server/socket/');
const {Driver, Ride} = require('./server/models');


const routes = require('./server/routes/index'); 
const config = require('./server/config/serverConfig'); 


class Server{

    server = null
    io = null
    constructor(){
        this.port =  process.env.PORT || 5001;
        this.host =  process.env.IP ||  `localhost`;
        this.app = express();
        this.http = http.Server(this.app);
    }

    appConfig(){        
        new config(this.app);
    }

    /* Including app Routes starts*/
    includeRoutes(){
        new routes(this.app).routesConfig();
    }

    sleep (milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
      }
    /* Including app Routes ends*/  
    appExecute(){

        this.appConfig();
        this.includeRoutes();
    
        this.server =  this.http.listen(this.port, () => {
            console.log(`Listening on http://${this.host}:${this.port}`);
        });

        this.io = require("socket.io")(this.server)
        this.io.on("connection" , (socket)=>{
            socket.on('update_pos_driver',async(id)=>{
                const driver = await Driver.findOne({
                    _id:id
                }).select('firstName lastName city email carCompany isActive inMission isWorking carType push_id phoneNumber  currentPosition rates')
                this.io.sockets.emit(`${driver._id}_driver` , driver)
            })

            socket.on('get_ride',async(id)=>{
                const ride = await Ride.findOne({
                    _id:id
                })
                .populate("driver", 
                { 
                  email:true, 
                  isActive:true, 
                  isWorking:true,
                  inMission:true,
                  carCompany:true,
                  carType:true,
                  phoneNumber:true, 
                  firstName:true,
                  lastName:true,
                  push_id:true,
                  rates:true,
                  city:true,
                  currentPosition:true
                })
                .populate("client", 
                { 
                  full_name:true, 
                  email:true, 
                  push_id:true, 
                  phone_number:true, 
                  currentPosition:true,
                  rates:true
                })
                this.io.sockets.emit(`${ride._id}_ride` , ride)
            })
        })
        Emmitter.on("ride_request",async (data)=> {
           this.io.sockets.emit(`${data.driver._id}_rides_created` , data)
           try {
            await this.sleep(70000)
            const ride = await Ride.findOne({
                _id:data.id
            })
            .populate({
                path: 'driver',
                select:`email 
                isActive 
                isWorking 
                inMission 
                carCompany
                carType
                phoneNumber 
                firstName
                lastName
                push_id
                city
                currentPosition`,
                populate: {
                  path: 'rates',
                  model: 'UserRate',
                  select:'stars'
               }
              })
              .populate({
              path: 'client',
              select: `full_name 
                email 
                push_id 
                phone_number
                currentPosition`,
                populate: {
                  path: 'rates',
                  model: 'DriverRate',
                  select:'stars'
               }
              })
            if(ride.status === "pending"){
                const driverRates = ride.driver.rates
                const userRates = ride.client.rates
                const sommeDriverRates  = driverRates.reduce((accumulator, currentValue) => accumulator + parseFloat(currentValue.stars), 0)
                const sommeUserRates  = userRates.reduce((accumulator, currentValue) => accumulator + parseFloat(currentValue.stars), 0)
                const driverRate = Math.round(sommeDriverRates / driverRates.length).toFixed(1)
                const userRate = Math.round(sommeUserRates / userRates.length).toFixed(1)
                
                await Ride.updateOne({ _id:ride.id } , {status:"rejected"});
                this.io.sockets.emit(`${data.driver._id}_rides_updated` , {...ride.toObject() , driverRate , userRate , status:'rejected'})
                await ride.notify({...ride.toObject() , driverRate , userRate , status:'rejected'})
                
            }  
           } catch (error) {
             this.io.sockets.emit(`error_rides_created` , error)
           }
        })
        Emmitter.on("ride_updated",(data)=>{
            this.io.sockets.emit(`${data.driver._id}_rides_updated` , data)
        })

    }

}

const app = new Server();
app.appExecute();