const express = require('express');
const app = express.Router();
const ProductCtrl = require('../Controller/getProduct')

app.post('/postproduct', ProductCtrl.postProduct);

app.get('/getProduct', ProductCtrl.getProduct);

app.get('/getsingleProduct/:prodId', ProductCtrl.getSingleProduct);

app.get('/getProductbytype', ProductCtrl.getProductbytype);

module.exports = app;