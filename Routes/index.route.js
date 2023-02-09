const express = require('express');
const app = express();

app.use('/api/v1/', require('./userDetail.route'))
app.use('/api/v1/', require('./product.route'))
app.use('/api/v1/', require('./sampleReport.route'))
app.use('/api/v1/', require('./fileUpload.route'))


app.use(function (req, res, next) {
    //response with html page
    return res.status(404).json({
        status: 404,
        message: 'API NOt found please check the end point and the HTTP request type! or contact at devops teams!',
        data: {
            url: req.url
        }
    })
})

module.exports = app;