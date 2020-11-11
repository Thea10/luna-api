const Joi = require("joi");
const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth.config");

const inputValidate = (req, res, next) => {
  const schema = {
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    phone: Joi.string()
      .min(5)
      .max(14)
      .required(),
    email: Joi.string().required(),
    password: Joi.string()
      .min(5)
      .required(),
  };

  const { error } = Joi.assert(req.body, schema);
  if (error) return res.status(400).send(error.details[0].message);
  next();
};

const EmailIsPassword = (req, res, next) => {
  if (req.body.email && req.body.password) {
    if (req.body.email === req.body.password) {
      return res.status(400).send({ message: "Your email and password cannot be the same" });
    }
  }
  next();
};

const verifyToken = (req, res, next) => {
  let token = req.headers["authorization"];

  if (!token) {
    return res.status(403).send({ message: "Please provide token" });
  }
  jwt.verify(token, authConfig.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Authorization Failed" });
    }
    req.userId = decoded.id;
    next();
  });
};

const sharedValidation = {
  inputValidate,
  EmailIsPassword,
  verifyToken,
};

module.exports = sharedValidation;
