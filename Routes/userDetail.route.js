const express = require('express')
const app = express.Router()
const ctrl = require('../Controller/userController')
const { isEmailExist, compareWithOldPassword, verifyTokenValidity, checkTheCurrentPasswordMatches, hashPassword, verifyUserToken } = require('../hooks/index')
const { joiSignupValidate, joiForgotPasswordValidate, joiloggedinValidate, joiResetPassword, joiResetPasswordWithClosed } = require('../middleware/Joivalidation/user.validation')

app.post('/sign-up', joiSignupValidate, ctrl.create)
app.post('/login', joiloggedinValidate, ctrl.login)
app.post('/forgotpassword', joiForgotPasswordValidate, ctrl.forgotPassword)
app.patch('/email/:email/password/reset/token/:token', joiResetPassword, isEmailExist, compareWithOldPassword, verifyTokenValidity, hashPassword, ctrl.resetPassword)
app.patch('/password/reset', joiResetPasswordWithClosed, verifyUserToken, checkTheCurrentPasswordMatches, hashPassword, ctrl.resetPasswordWithClosed)
// app.post('/userlogin', ctrl.userlogin)

module.exports = app;