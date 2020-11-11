//const Joi = require("joi");
const mongoose = require("mongoose");
const Cart = require("./cart.model");
const Order = require("./order.model");
const WishList = require("./wishlist.model");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    phone: { type: String, minlength: 5, maxlength: 14 },
    email: { type: String, required: true },
    address: { type: String },
    password: { type: String, minlength: 5 },
    wishlist:  WishList.schema,
    cart:  Cart.schema,
    order:[ Order.schema]
  })
);

module.exports = User;
