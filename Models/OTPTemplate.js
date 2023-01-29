const mongoose = require('mongoose')

const userLoginOtpSchema = mongoose.Schema({
    smsTemplate: {
        type: String,
        required: true
    },
    dltld: {
        type: String,
        required: true
    },
    smsType: {
        type: String,
        required: true
    }
}, {
    timeStamps: true
})

let msgTemplateModel = mongoose.model('OtpMsgTemplates', userLoginOtpSchema, 'OtpMsgTemplates')
module.exports = msgTemplateModel;