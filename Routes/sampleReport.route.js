const express = require('express')
const app = express.Router();
const multer = require('multer');
const multipartmiddleware = multer()

const reportCtrl = require('../Controller/getReport')
// const { } = require('../')

app.get('/samplerprt', reportCtrl.getReport);
app.post('/samplerprtupload', reportCtrl.uploadReport);
app.post('/sampleanotherrprtupload', multipartmiddleware.single('file'), reportCtrl.uploadAnotherReport);


module.exports = app