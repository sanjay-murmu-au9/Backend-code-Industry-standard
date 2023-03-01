const axios = require('axios');
const __ = require('../Utilities/Response')

module.exports = async () => {
    try {
        let response = await axios({
            method: method, headers: {
                'Content-type': 'application/json'
            }, url: url,
            data: data
        })
        console.log(response, "<<Axis Response")
        if (response) {
            return response
        } else {
            __.errorMsg(req, res, 404, 'no data found')
        }

    } catch (error) {
        console.log(error)
        __.errorMsg(req, res, 500, 'Internal server error', error)
    }
}