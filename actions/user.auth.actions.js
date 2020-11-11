const authConfig = require("../config/auth.config");
const jwt = require("jsonwebtoken");
const User = require("../models/user-model");
const bcrypt = require("bcrypt");

// const { users } = require("../models");

const saltRounds = 5;

async function signUp(req, res) {
 
 
  try {
    const user = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      phone: req.body.phone,
      password: hashPassword(req.body.password),
    });
    
  
    await user.save((err, user) => {
      if (err) {
        res.status(403).send({ message: err });
        return;
      }
      res.status(200).send({
        message: "User was registered successfully!, please login",
        user: user,
      });
    });
  } catch (ex) {
    res.status(403).send({message: ex})
  }


}

async function signIn(req, res) {
  User.findOne({
    email: req.body.email,
  })
  .exec(async (err, user) => {
    if (err) {
      res.status(505).send({ message: err });
      return;
    }
    if (!user) {
      return res
        .status(404)
        .send({
          message: "We can't find this email, please sign up to start shopping",
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
      user_details: user,
    });
  });
}

function hashPassword(password) {
  let hash =   bcrypt.hashSync(password, saltRounds)
 return hash;
 // return hash;
}

const authActions = {
  signUp,
  signIn,
  hashPassword,
};

module.exports = authActions;
