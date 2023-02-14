const Query = require('../Queries/userQuery')
const BasicQuery = require('../basic_config/basic_config_query')
const __ = require('../Utilities/Response')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const jwtSecret = process.env.secret;


module.exports = async (req, res, next) => {
    try {

        if (req.headers['x-access-token'] === undefined) {
            return __.customMsg(req, res, 401, 'x-access-token is required')
        }

        //getting the token
        let token = req.headers['x-access-token'];

        //cheacking token is present
        if (!token) {
            return __.customMsg(req, res, 401, 'token is required')
        }
        // get jwt token
        let payload = await jwt.verify(token, jwtSecret, function (err, payload) {
            if (err) {
                console.log(err, "ERR")
                return {
                    error: "tokenExpired!"
                }
            } else return payload;

        })

        if (payload && payload.error && payload.error === 'tokenExpired') {
            return __.errorMsg(req, res, 401, 'Token expired Please login again!')
        }

        if (payload && payload.data && JSON.parse(payload.data)) {
            req.user = {
                token: token,
                ...JSON.parse(payload.data)
            }
            next()
        } else {
            return __.errorMsg(req, res, 401, 'Unauthorized access !')
        }

    } catch (error) {
        return __.errorMsg(req, res, 500, 'something went wrong please try after sometime!', error)
    }
}