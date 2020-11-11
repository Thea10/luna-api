// const bcrypt = require("bcryptjs/dist/bcrypt");

const User = require('../models/user-model');
//const mongoose = require('mongoose');




const EmailExists = (req, res, next) => {
    User.findOne({
        email: req.body.email
    }).exec((err, user) =>{
        if (err){
            res.status(500).send({message: err});
            return;
        } 
        if(user){
            res.status(400).send({message: "Email already exists, please use another email or log in"});
            return;
        }
        next();
    } )
 }

 const PhoneExists = (req, res, next) => {
    User.findOne({
        phone: req.body.phone
    }).exec((err, user) =>{
        if (err){
            res.status(500).send({message: err});
            return;
        } 
        if(user){
            res.status(400).send({message: "Phone number already exists, please use another phone number or log in"});
            return;
        }
        next();
    } )
 }



const validateUserInput = {
    EmailExists,
    PhoneExists,
};

module.exports = validateUserInput;

