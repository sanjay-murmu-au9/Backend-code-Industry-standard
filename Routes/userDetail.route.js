const express = require('express')
const app = express.Router()
const ctrl = require('../Controller/userController')
// const { joiSignupValidate } = require('../middleware/Joivalidation/user.validation')

app.post('/sign-up', ctrl.create)
app.post('/login', ctrl.login)
app.post('/userlogin', ctrl.userlogin)

module.exports = app;