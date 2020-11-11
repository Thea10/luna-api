const mongoose = require("mongoose");
const Product = require("./product.model");

const Order = mongoose.model(
  "Order",
  mongoose.Schema({
    products: [Product.schema],
    productCount: {
      type: Number 
    },
    totalPrice: {
      type: Number
    },
    date: { type: Date, default: Date.now },
    fulfilled: {type: Boolean, default: false},
    dateFulfilled: {type: Date, default: null}
  })
);

module.exports = Order;
