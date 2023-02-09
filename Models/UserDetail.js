const mongoose = require('mongoose');
const autoPopulate = require('mongoose-autopopulate');
// require('mongoose-type-email');
const schema = mongoose.Schema;

//schema
const users = new schema(
    {
        name: {
            type: String,
            // required: true,
            trim: true
        },
        phone: {
            type: String,
            // required: true,
            trim: true
        },
        email: {
            type: String,
            // required: true
        },
        password: {
            type: String
        },
        role: {
            type: String,
            enum: ['ADMIN', 'USER'],
            default: 'USER'
        },
        phoneOtp: String,
        isDeleted: {
            type: Number,
            enum: [1, 0], // 0 active, 1 soft_deleted
            default: 0

        },
        status: {
            type: Number,
            default: 1,
            enum: [0, 1] // 1 active,0 inactive
        },
        failedAttemptedCount: {
            type: Number,
            default: 0
        },
        loginBlocked: {
            type: Boolean,
            default: false
        },
        loginDetails: [
            {
                loggedInAt: {
                    type: Date
                },
                loginIp: {
                    type: String,
                    default: ''
                }
            }
        ]
    },
    {
        timestamps: true
    });

// creating unique component index
users.index({
    'email': 1,
    'phone': 1
})

//exporting the entire module;
module.exports = mongoose.model('users', users)