const express = require('express');
const app = express.Router();
const ProductCtrl = require('../Controller/getProduct')

app.post('/product',ProductCtrl.postProduct);

app.get('/getProduct',ProductCtrl.getProduct);

app.get('/getProductbytype',ProductCtrl.getProductbytype);

module.exports = app;