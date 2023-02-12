const mongoose = require('mongoose')
const autopopulate = require('mongoose-autopopulate');
require('mongoose-type-email');
const Schema = mongoose.Schema;

const forgotPassword = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            autopopulate: {
                select: ['name', 'phone']
            }
        },
        email: {
            type: String
        },
        token: {
            type: String,
        },
        status: {
            type: String,
            default: 'new',
            lowercase: true,
            enum: ['new', 'changed']
        }


    }, {
    timestamps: true
}
);
forgotPassword.index({
    userId: 1
})

forgotPassword.plugin(autopopulate)

module.exports = mongoose.model('forgot_password', forgotPassword)