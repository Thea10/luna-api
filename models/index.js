const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;
db.users = require("./user-model");
db.products = require("./product-model");
db.admin = ("./admin.model.js");



module.exports = db;
