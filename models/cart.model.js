const mongoose = require("mongoose");
const Product = require("./product.model");

const Cart = mongoose.model(
  "Cart",
  new mongoose.Schema({
    products: [Product.schema],
    productCount: {
      type: Number
    },
    totalPrice: {
      type: Number
    },
  })
);

module.exports = Cart;
