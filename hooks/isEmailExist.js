const Query = require('../Queries/userQuery')
const __ = require('../Utilities/Response')


module.exports = async (req, res, next) => {
    try {
        let email = req.body.email || req.params.email || 'sanjaymurmu40work@gmail.com';
        // check the email unique or not
        let isEmailExist = await Query.IsEmailExist(email)

        if (isEmailExist.success) {
            req.body = {
                ...req.body,
                userId: isEmailExist.data._id
            }
            next()
        } else {
            return __.errorMsg(req, res, 409, 'Email doesn\'t exist !', 'invalid credentails')
        }
    } catch (error) {
        return __.errorMsg(req, res, 500, 'something went wrong please try after sometime!', error)
    }
}