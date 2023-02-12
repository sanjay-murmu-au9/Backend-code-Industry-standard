const Query = require('../Queries/userQuery')
const __ = require('../Utilities/Response')
const bcrypt = require('bcryptjs');
const jwtSecret = process.env.secret;
const jwt = require('jsonwebtoken')


module.exports = async (req, res, next) => {
    try {
        let email = req.body.email || req.params.email || 'sanjaymurmu40work@gmail.com';
        token = req.params.token || '00d83a66cf454ec11966bf2b7863594e50fb7be8d6e9410dbc61c32273fb0942c31ff271b481558b09d4e67fa1fbd356d3bf7bfe94cf8aff459b3c4614824a6545860a8fbdca0e70b23ced6d416aa195eb10aaf4910260bc7b9eaa97efdf49a6cdc985b49853b9fe1775940ad58af439bf4e730eb88e2b16fcd2536c275ae0941bfd93f07680f5edbca5fa6485ef9a',
            payload = {
                data: ''
            } // getting  the payload


        // check the email unique or not
        let getTokenDetails = await Query.getTokenDetails(email)
        // console.log(getTokenDetails, "GETTOKENDETAILS")
        if (getTokenDetails.success == true) {
            console.log(token, "<<<token")
            payload = await jwt.verify(token, jwtSecret, function (err, payload) {
                console.log(err, "<<<err")
                if (err) {
                    return __.errorMsg(req, res, 409, 'Token expired!')
                } else {
                    console.log(payload, "<<<<<<<PAYLOAD")
                    return payload;
                }
            })
            // console.log(payload, "<<<PAYLOAD")

        } else {
            return __.errorMsg(req, res, 409, 'Token expired please generate a new request to change password!')
        }
        // console.log(payload, "<<<<<payload")

        if (getTokenDetails.data.token === payload.data) {
            next()
            console.log('YOU Have passed the verifyTOkenValidity>>>>>>>>>>>>>>>>>>>')
        } else {
            return __.customMsg(req, res, 401, 'Invalid Token')
        }


    } catch (error) {
        return __.errorMsg(req, res, 500, 'something went wrong please try after sometime! sanjay murmu', error)
    }
}