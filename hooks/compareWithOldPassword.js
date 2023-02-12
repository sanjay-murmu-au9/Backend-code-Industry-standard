const Query = require('../Queries/userQuery')
const __ = require('../Utilities/Response')
const bcrypt = require('bcryptjs');


module.exports = async (req, res, next) => {
    try {
        let email = req.body.email || req.params.email || 'sanjaymurmu40work@gmail.com';
        // check the email unique or not
        let isEmailExist = await Query.getUserPassword(email)

        if (isEmailExist.success) {

            // bcrypt compare password
            let isEqual = bcrypt.compareSync(isEmailExist.data.password, req.body.password) // true, which means user password is correct;
            //CHECK wheather the password matches
            // console.log(req.body.userId, "<<UserId", isEqual, "IsEqual")
            if (isEqual) {
                // new error('New password is same as the existing password')
                return __.customMsg(req, res, 409, 'The new password is same as the existing password!')
            } else {
                req.body.userId = isEmailExist.data._id
                next()
            }
        } else {
            return __.errorMsg(req, res, 409, 'Email doesn\'t exist !', 'invalid credentails')
        }
    } catch (error) {
        return __.errorMsg(req, res, 500, 'something went wrong please try after sometime!', error)
    }
}