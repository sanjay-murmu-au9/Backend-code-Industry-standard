const Model = require('../Models/BasicConfig')
class BasicConfigController {
    // get Token expire in time
    GET_TOKEN_EXPIRE_IN_MIN = async () => {
        try {
            return await Model.aggregate([
                {
                    $match: {
                        'configName': 'TOKEN_EXPIRE_IN_MIN'
                    }
                }
            ]).allowDiskUse(true)
                .then((res) => {
                    if (res && res.length) {
                        return {
                            success: true,
                            data: isNaN(res[0].configValue) ? 40 : parseInt(res[0].configValue)
                        }
                    }
                })

        } catch (error) {
            console.log(error)
            return {
                success: false,
                error: error
            }
        }
    }

    GET_CRYPT_SECRET_KEY = async () => {
        try {
            return await Model.aggregate([
                {
                    $match: {
                        'configName': 'GET_CRYPT_SECRET_KEY'
                    }
                }
            ]).allowDiskUse(true).then((res) => {
                if (res && res.length) {
                    return {
                        success: true,
                        data: isNaN(res[0].configValue) ? "12345secretkey12345678" : res[0].configValue

                    }
                } else {
                    return {
                        success: false,
                    }
                }
            })

        } catch (error) {
            console.log(error)
            return {
                success: false,
                error: error
            }
        }
    }

    GET_FORGOT_PASSWORD_MIN = async () => {
        return await Model.aggregate([
            {
                $match: {
                    'configName': 'FORGET_PASSWORD_IN_MIN'
                }
            }
        ]).allowDiskUse(true).then((res) => {
            // console.log(res, "<<<res")
            if (res && res.length) {
                return {
                    success: true,
                    data: isNaN(res[0].configValue) ? 40 : parseInt(res[0].configValue)
                }
            } else {
                return {
                    success: false,

                }
            }
        })
    }
}

module.exports = new BasicConfigController();