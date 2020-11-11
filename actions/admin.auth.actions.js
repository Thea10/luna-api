const authConfig = require("../config/auth.config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.model");
const { hashPassword } = require("./user.auth.actions");

// const { users } = require("../models");

async function addAdmin(req, res) {

  try {
    const user = new Admin({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      phone: req.body.phone,
      password: hashPassword(req.body.password),
      role: "Administrator"
    });
  
    await user.save((err, user) => {
      if (err) {
        res.status(403).send({ message: err });
        return;
      }
      res.send({
        message: "Administrator was added successfully!, please login",
        user: user,
      });
    });
    
  } catch (ex) {
    res.status(403).send({message: ex})

  }

}

async function adminSignIn(req, res) {
  Admin.findOne({
    email: req.body.email,
  }).exec(async (err, user) => {
    if (err) {
      res.status(505).send({ message: err });
      return;
    }
    if (!user) {
      return res
        .status(404)
        .send({
          message: "We can't find this email, please contact support",
        });
    }

 

    var correctPassword = await bcrypt.compare(req.body.password, user.password);

    if (!correctPassword) {
      return res.status(401).send({ message: "Incorrect password" });
    }

    var usertoken = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: "1d",
    });
    res.status(200).send({
      user_token: usertoken,

      user_details: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
    });
  });
}





const authActions = {
  addAdmin,
  adminSignIn,
};

module.exports = authActions;
