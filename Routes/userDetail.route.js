const express = require('express')
const app = express.Router()
const ctrl = require('../Controller/userController')
const { isEmailExist, compareWithOldPassword, verifyTokenValidity, hashPassword } = require('../hooks/index')
const { joiSignupValidate, joiForgotPasswordValidate, joiloggedinValidate, joiResetPassword } = require('../middleware/Joivalidation/user.validation')

app.post('/sign-up', joiSignupValidate, ctrl.create)
app.post('/login', joiloggedinValidate, ctrl.login)
app.post('/forgotpassword', joiForgotPasswordValidate, ctrl.forgotPassword)
app.patch('/resetpassword', joiResetPassword, isEmailExist, compareWithOldPassword, verifyTokenValidity, hashPassword, ctrl.resetPassword)
// app.post('/userlogin', ctrl.userlogin)

module.exports = app;