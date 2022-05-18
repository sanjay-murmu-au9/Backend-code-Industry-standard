require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser =require('body-parser');
const environment = process.env.NODE_ENV || "development"
const morgan = require('morgan');
const mongoSanitizer = require('express-mongo-sanitize');
const cors = require('cors');
const chalk = require('chalk');
const helmet = require('helmet');
const cluster = require('cluster');


let envConfig;

switch (environment){
    case 'development':
        envConfig = require('./config/dev.config.json');
        break;
    
    case 'production':
        envConfig = require('./config/prod.config.json');
        break;
    
    default:
        envConfig = require('./config/local.config.json');
        break;
}
module.exports = envConfig;
// console.log(envConfig)


//Configuring Cluster and server port;
let debugMode = (process.env.DEBUG_MODE) || true;

if(debugMode){
    app.listen(envConfig._LOCAL_PORT_,()=>{
        console.log(chalk.blue(`[ ✓ ] app running ${process.env.ServerName} on port : ${envConfig._LOCAL_PORT_}`))
    });
}else{
 if(!cluster.isMastry){
     app.listen(envConfig._LOCAL_PORT_,()=>{
      console.log(chalk.blue(`[ ✓ ] App Running ${process.env.ServerName}  on port : ${envConfig._LOCAL_PORT_}`))
     })
 }
}

// Middleware
app.use(bodyParser.urlencoded({extended:true,limit:'25mb'}))
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(cors())
app.use(helmet())
app.use(mongoSanitizer())

require('./DataAdaptor/connection');


// Router Config
app.use(require('./Routes/index.route'))