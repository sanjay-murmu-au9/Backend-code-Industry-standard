const { pipe } = require('ramda');

//getting all the middleware packages

const logger = require('./logger')

//exporting the module;

module.exports = app => {
    return pipe(
        logger
    )(app)
};