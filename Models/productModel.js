const mongoose = require('mongoose');
// const autopopulate = require('mongoose-autopopulate');
const Schema = mongoose.Schema;

// schema 
const Product = new Schema({
  title: {
    type: String,
    // required: true
  },
  imageUrl: {
    type: String,
    // required: true
  },
  price: {
    type: Number,
    // required: true
  },
  description: {
    type: String,
    // required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('products', Product)