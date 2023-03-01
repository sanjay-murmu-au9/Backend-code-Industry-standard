const express = require('express')
const app = express.Router()
const ctrl = require('../Controller/getReport')


app.get('/downloadreport', ctrl.downloadReport)

module.exports = app