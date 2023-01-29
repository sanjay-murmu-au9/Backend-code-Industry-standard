const express = require('express')
const app = express.Router()
const ctrl = require('../Controller/userController')

app.post('/userlogin', ctrl.userlogin)

module.exports = app;