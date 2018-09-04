
/*---------------------------------------------------------------------------------
   * @ file        : server.js
   * @ description : This is the main startup server file to init the application.
   * @ author      : Duddukuri Mahesh
   * @ date        : 04/09/2018.
----------------------------------------------------------------------------------*/

'use strict';

// Include internal and external modules.
const Hapi     = require('hapi');
const mongoose = require('mongoose');
const plugIns  = require('./PlugIns');
const server   = new Hapi.Server();
const routes   = require('./Routes');


server.connection({
    host: "127.0.0.1",
    port: "4000",
    routes: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['x-logintoken'],
            additionalExposedHeaders: ['x-logintoken']
        }
    },
    labels: ['api']
},{
    timeout:{
        server: 50000
    }
});


const apiServer = server.select('api');

console.log('\x1b[32m',"+++ SERVER SETTINGS LOADED +++\r\n");

server.route(routes);

server.register(plugIns,function(err) {
    
    if (err) {
        throw err;
    }
    
    server.start(function(err) {
        if (err) {
            console.log('\x1b[31m',"+++ Error starting server +++");
            throw err;
        } else{
           
            console.log('\x1b[32m', '+++ SERVER STARTED +++\r\nServer running ');
        };
    });
});


const Db_Options = {
    db     : { native_parser: true },
    server : { poolSize: 5 },
    user   : "",
    pass   : ""
};

const mongoUrl = 'mongodb://'+"127.0.0.1"+':'+"27017"+'/'+"taskDb";

mongoose.Promise = global.Promise;
mongoose.connect(mongoUrl,Db_Options,function(err) {
    if (err) {
        console.log('\x1b[31m',"DB Error: "+ err);
        process.exit(1);
    } else{
        
        console.log('\x1b[32m','MongoDB Connected :'+ mongoUrl);
    }
});
