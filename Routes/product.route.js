const express = require('express');
const app = express.Router();
const ProductCtrl = require('../Controller/getProduct')
const { verifyUserToken } = require('../hooks/index')
const cron = require('node-cron')

app.post('/postproduct', ProductCtrl.postProduct);

// cron.schedule('* * * * * *', async () => {
//     let a = await ProductCtrl.getSingleProduct;
//     console.log(a, '============>>>')
// })

app.get('/getProduct',/* verifyUserToken,*/ ProductCtrl.getProduct);

app.get('/producttest', ProductCtrl.testProd)
app.get('/getsingleProduct/:prodId', ProductCtrl.getSingleProduct);

app.get('/getProductbytype', ProductCtrl.getProductbytype);
app.get('/allOrderStatus', verifyUserToken, ProductCtrl.getAllOrder)


module.exports = app;