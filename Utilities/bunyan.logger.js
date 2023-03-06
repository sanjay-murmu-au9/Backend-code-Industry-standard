const bunyan = require('bunyan');
const fs = require('fs')


const logStream = fs.createWriteStream('logs/myBunyanLog.log', { flags: 'a' });

//creating a logger instance
const logger = bunyan.createLogger({
    name: 'myBunyanLog',
    streams: [
        { stream: logStream }
    ]
})
//export the logger instance

module.exports = logger;