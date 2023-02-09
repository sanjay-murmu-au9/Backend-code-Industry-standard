const OTPTemplate = require('../Models/OTPTemplate')
const UserModel = require('../Models/UserDetail')
const BasicConfig = require('../Models/BasicConfig')
const _ = require('lodash')
const mongoose = require('mongoose')

class UserTemp {
    async otpTemplate() {
        try {
            return await OTPTemplate.find({ 'smsType': "userLogin_OTP" })
        } catch (error) {
            console.log(error)
        }
    }

    async isEmailUnique(email, mobile) {
        try {
            return await UserModel.findOne({
                $or: [
                    { "email": email, 'phone': mobile }
                ],
                'isDeleted': 0
            }).lean()
                .then((res) => {
                    if (res && !_isEmpty(res))
                        return { success: true }
                    else return { success: 'false' }
                })
        } catch (error) {
            console.log(error)
        }
    }

    async GET_MIN_SALT_FOR_HASHING() {
        try {
            return BasicConfig.aggregate([
                {
                    $match: {
                        "basicConfig": "MIN_SALT_FOR_HASHING"
                    }
                }
            ]).allowDiskUse(true)
                .then((res) => {
                    if (res && res.length)
                        return {
                            success: true,
                            data: isNaN(res[0].configValue) ? 10 : parseInt(res[0].configValue)
                        }
                    else return {
                        success: false
                    }
                })
        } catch (error) {

            console.log(error)
        }
    }

    async saveNewUser(body) {
        try {
            return await UserModel.create(body)
        } catch (error) {
            console.log(error)
        }
    }

    async IsEmailExist(email) {
        try {
            return await UserModel.findOne({ 'email': email, 'isDeleted': 0 }).lean().then((res) => {
                if (res && !_.isEmpty(res)) {
                    return {
                        success: true,
                        data: res
                    }
                } else return {
                    success: false
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    async getUserPassword(email) {
        return await UserModel.findOne({
            'email': email,
            'isDeleted': 0
        }).select({ 'password': 1, 'failedAttemptedCount': 1, 'loginBlocked': 1 })
            .lean()
            .then((res) => {
                if (res && !_.isEmpty(res)) {
                    return {
                        success: true,
                        data: res
                    }
                } else {
                    return {
                        success: false
                    }
                }
            })
    }

    async updateFailedAttemptedCount(req, res, count, flag) {
        try {
            let loginBlocked_flag = flag || false;
            await UserModel.updateOne({ email: req.body.email }, {
                $set: { failedAttemptedCount: count, loginBlocked: loginBlocked_flag }
            })
        } catch (error) {
            console.log(error)
        }
    }

    async updateLoginDetail(objectId) {
        // let ObjectId = mongoose.types.ObjectId(objectId)
        console.log(objectId, "<<<<ObjectId")
        try {
            return await UserModel.updateOne(
                {
                    _id: objectId,
                    // 'status': 1
                },
                {
                    $push: {
                        loginDetails: {
                            loggedInAt: new Date()
                        }
                    },
                    $set: {
                        failedAttemptedCount: 0,
                        loginBlocked: false
                    }
                }
            )
        } catch (error) {
            console.log(error)
            return {
                success: false,
                error: error
            }
        }
    }
}

module.exports = new UserTemp;