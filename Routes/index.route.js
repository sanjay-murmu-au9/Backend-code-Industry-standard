const express = require('express');
const app = express();

app.use('/api/v1/',require('./product.route'))


module.exports = app;