const winston = require('winston');
const { createLogger, format, transports } = winston;
const { combine, timestamp, printf } = format;

// create logger instance
const logger = createLogger({
    level: 'info',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        printf(({ level, message, timestamp }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [new transports.File({ filename: 'logs/logger_info.log' })],
});

// create custom stream object for morgan middleware
const stream = {
    write: function (message) {
        logger.info(message.trim());
    },
};

module.exports = { logger, stream };




// const winston = require('winston');
// const { createLogger, format, transports } = winston;
// const appRoot = require('app-root-path');
// const { combine, timestamp, json } = format;

// const loggers = {
//     success: winston.createLogger({
//         level: 'info',
//         format: combine(
//             timestamp({
//                 format: 'DD-MM-YYYY:HH:mm:ss'
//             }),
//             json()
//         ),
//         transports: [new winston.transports.File({ filename: `${appRoot}/logger_info/app-info.log` })],
//     }),

//     failed: winston.createLogger({
//         level: 'error',
//         format: combine(
//             timestamp({
//                 format: 'DD-MM-YYYY HH:mm:ss'
//             }),
//             json(),
//         ),
//         transports: [new winston.transports.File({ filename: `${appRoot}/logger_info/app-error.log` })]
//     })
// }

// module.exports = loggers;