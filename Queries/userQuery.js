const OTPTemplate = require('../Models/OTPTemplate')

class UserTemp {
    async otpTemplate() {
        try {
            return await OTPTemplate.find({ 'smsType': "userLogin_OTP" })
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = new UserTemp;