const Admin = require("../models/admin.model");
//const mongoose = require('mongoose');

//id: 5f92ef1b25c5801e04fdc02b
const AdminMailExists = (req, res, next) => {
  Admin.findOne({
    email: req.body.email,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (user) {
      res.status(400).send({
        message: "Email already exists, please use another email or log in",
      });
      return;
    }
    next();
  });
};

const AdminPhoneExists = (req, res, next) => {
  Admin.findOne({
    phone: req.body.phone,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (user) {
      res.status(400).send({
        message:
          "Phone number already exists, please use another phone number or log in",
      });
      return;
    }
    next();
  });
};

async function userIsAdmin(req, res, next) {
  //   //5f7d0b7365ddd7748128ccb8919d

  //  // console.log(req.params.id);
  try {
    let user = await Admin.findById(req.params.adminid);
    if (!user) return res.status(403).send({ message: "Unauthorized" });
    if (user.role) {
      next();
      return;
    }
  } catch (ex) {
    res.status(403).send({ message: "Unauthorized" });
  }
 
}
const validateAdminInput = {
  AdminMailExists,
  AdminPhoneExists,
  userIsAdmin
};

module.exports = validateAdminInput;
