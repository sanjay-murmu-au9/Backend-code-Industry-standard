const { transports, format, createLogger } = require('winston');
const winstonRotator = require('winston-daily-rotate-file');


module.exports = createLogger({
    format: format.combine(
        format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
        format.printf((info) =>
            `${info.level}: ${info.timestamp}: ${info.message}`
        )
    ),
    transports: [
        new transports.DailyRotateFile({
            name: 'access-file',
            level: 'info',
            filename: './logs/access.log',
            json: false,
            datePattern: 'yyyy-MM-DD',
            prepend: true,
            maxFiles: 10
        }),

        new transports.DailyRotateFile({
            name: 'error-file',
            level: 'error',
            filename: './logs/error.log',
            json: false,
            datePattern: 'yyyy-MM-DD',
            prepend: true,
            maxFiles: 10
        })
    ]
})



// const { transports, format, createLogger } = require('winston');
// const winstonRotator = require('winston-daily-rotate-file');
// const { combine, timestamp, printf } = format;
// const colors = require('cli-color');

// const myFormat = printf((info) => {
//     const { level, message, timestamp } = info;
//     const colorMap = {
//         info: 'blue',
//         error: 'red',
//         warn: 'yellow',
//         verbose: 'green'
//     };
//     const color = colors[colorMap[level]] || colors.whiteBright;
//     return color(`${timestamp} [${level.toUpperCase()}]: ${message}`);
// });

// module.exports = createLogger({
//     format: combine(
//         timestamp(),
//         myFormat
//     ),
//     transports: [
//         new winstonRotator({
//             name: 'access-file',
//             level: 'info',
//             filename: './logs/access.log',
//             json: false,
//             datePattern: 'yyyy-MM-DD',
//             prepend: true,
//             maxFiles: 10
//         }),
//         new winstonRotator({
//             name: 'error-file',
//             level: 'error',
//             filename: './logs/error.log',
//             json: false,
//             datePattern: 'yyyy-MM-DD',
//             prepend: true,
//             maxFiles: 10
//         })
//     ]
// });
