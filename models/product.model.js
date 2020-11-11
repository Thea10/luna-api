const mongoose  = require("mongoose");

const Product = mongoose.model(
    "Product",

     new mongoose.Schema({
        name: {type: String, required: true},
        price: {type: Number, required: true},
        size: {type: Number, required: true},
        imgUrl: {data: Buffer, contentType: String},
       //   wished: {type: Boolean},
        count: {type: Number, required: true}
    })
);

module.exports = Product;