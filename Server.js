require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || "development"
const morgan = require('morgan');
const mongoSanitizer = require('express-mongo-sanitize');
const cors = require('cors');
const chalk = require('chalk');
const helmet = require('helmet');
const cluster = require('cluster');
const cron = require('node-cron')
const { logger, stream } = require('./Utilities/logger')


let envConfig;

switch (environment) {
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


if (debugMode) {
    app.listen(envConfig._LOCAL_PORT_, () => {
        console.log(chalk.blue(`[ ✓ ] app running ${process.env.ServerName} on port : ${envConfig._LOCAL_PORT_}`))
    });
} else {
    if (!cluster.isMastry) {
        app.listen(envConfig._LOCAL_PORT_, () => {
            console.log(chalk.blue(`[ ✓ ] App Running ${process.env.ServerName}  on port : ${envConfig._LOCAL_PORT_}`))
        })
    }
}

cron.schedule('* 1 * * * * ', () => {
    console.log('Hello Sanjay')
})

// Middleware
app.use(bodyParser.urlencoded({ extended: true, limit: '25mb' }))
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(cors())
app.use(helmet())
app.use(mongoSanitizer())

require('./DataAdaptor/connection');
// configure morgan middleware to use custom stream
app.use(morgan('combined', { stream }));

// your API routes and middleware go here...

// error handling middleware
app.use(function (err, req, res, next) {
    // log error message to file using logger instance
    logger.error(
        `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );

    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


// Router Config
app.use(require('./Routes/index.route'))