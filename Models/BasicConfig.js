const mongoose = require('mongoose')

const Schema = mongoose.Schema;
//schema
const basicConfig = new Schema({
    configName: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        default: 1,
    },
    releaseCode: {
        type: Number,
        required: false
    },
    releaseVersion: {
        type: String,
        required: false
    }

}, {
    timestamps: true
});

basicConfig.index({
    'configName': 1
})


module.exports = mongoose.model('basicConfig', basicConfig)