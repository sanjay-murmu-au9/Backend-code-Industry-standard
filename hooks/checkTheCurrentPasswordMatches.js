const Query = require('../Queries/userQuery')
const __ = require('../Utilities/Response')
const bcrypt = require('bcryptjs');


module.exports = async (req, res, next) => {
    try {

        // console.log(req.body.existingPassword, "<<<<<<<<<TOKEN")
        let getUserPassword = await Query.getUserPassword(req.user.email)

        if (getUserPassword.success) {

            //bcrypt compare password
            let isEqual = bcrypt.compareSync(req.body.existingPassword, getUserPassword.data.password)

            //check wheather the password matches;
            if (isEqual) {
                req.user.userId = getUserPassword.data._id;
                next()
            } else {
                return __.errorMsg(req, res, 409, 'password is incorrect!')
            }
        } else {
            return __.errorMsg(req, res, 409, 'password is incorrect!')
        }

    } catch (error) {
        return __.errorMsg(req, res, 500, 'something went wrong please try after sometime!', error)
    }
}