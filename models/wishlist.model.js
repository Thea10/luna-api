const mongoose = require('mongoose');
const Product = require('./product.model');


const WishList = mongoose.model(
    "WishList",
    new mongoose.Schema({
        products:  [Product.schema]
     })
)

module.exports = WishList;

