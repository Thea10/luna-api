//const Joi = require("joi");
const mongoose = require("mongoose");

const Admin = mongoose.model(
  "Admin",
  new mongoose.Schema({
    firstname: { type: String },
    lastname: { type: String },
    phone: { type: String, minlength: 5, maxlength: 14 },
    email: { type: String  },
    address: { type: String },
    password: { type: String,  minlength: 5 },
    role: { type: String }
  })
);

module.exports = Admin;
