const Query = require('../Queries/userQuery')
const BasicQuery = require('../basic_config/basic_config_query')
const __ = require('../Utilities/Response')
const bcrypt = require('bcryptjs');


module.exports = async (req, res, next) => {
    try {

        const saltRounds = await BasicQuery.GET_MIN_SALT_ROUND_FOR_HASHING().then((res) => { if (res.success) return res.data; else return 10 });

        let hashedPassword = bcrypt.hashSync(req.body.password, saltRounds); // hashing the password

        req.body.hashedPassword = hashedPassword;
        next()

    } catch (error) {
        return __.errorMsg(req, res, 500, 'something went wrong please try after sometime!', error)
    }
}