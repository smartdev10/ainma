'use strict';

const express = require("express");
const http = require('http');
const routes = require('./server/routes/index'); 
const config = require('./server/config/serverConfig'); 


class Server{

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
    
        this.http.listen(this.port, () => {
            console.log(`Listening on http://${this.host}:${this.port}`);
        });
    }

}

const app = new Server();
app.appExecute();