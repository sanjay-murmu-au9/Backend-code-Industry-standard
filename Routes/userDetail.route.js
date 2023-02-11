const express = require('express')
const app = express.Router()
const ctrl = require('../Controller/userController')
const { joiSignupValidate, joiForgotPasswordValidate, joiloggedinValidate } = require('../middleware/Joivalidation/user.validation')

app.post('/sign-up', joiSignupValidate, ctrl.create)
app.post('/login', joiloggedinValidate, ctrl.login)
app.post('/forgotpassword', joiForgotPasswordValidate, ctrl.forgotPassword)
app.post('/userlogin', ctrl.userlogin)

module.exports = app;