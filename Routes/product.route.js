const express = require('express');
const app = express.Router();
const ProductCtrl = require('../Controller/getProduct')
const { verifyUserToken } = require('../hooks/index')

app.post('/postproduct', ProductCtrl.postProduct);

app.get('/getProduct', verifyUserToken, ProductCtrl.getProduct);

app.get('/getsingleProduct/:prodId', ProductCtrl.getSingleProduct);

app.get('/getProductbytype', ProductCtrl.getProductbytype);
app.get('/allOrderStatus', verifyUserToken, ProductCtrl.getAllOrder)


module.exports = app;