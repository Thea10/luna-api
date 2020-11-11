//const express = require('express');
const { EmailIsPassword, verifyToken } = require('../middleware/shared');
const {  EmailExists, PhoneExists } = require('../middleware/user.validate');
const { signUp, signIn } = require('../actions/user.auth.actions');
const { getUserDetails, updateDetails, userAddToCart, userRemoveFromCart, userAddToWish, userPlaceOrder } = require('../actions/user.actions');
const { getAllProducts } = require('../actions/public.actions');

// const router = express.Router();


module.exports = function (userauth) {

    userauth.use(function (req, res, next) { 
        res.header("Access-Control-Allow-Headers", "authorization, Origin, Content-Type, Accept");
        next()
     });

     userauth.post('/api/auth/signup',[EmailExists, PhoneExists, EmailIsPassword], signUp);

     userauth.post('/api/auth/login', signIn);

     userauth.get('/api/me/:id', [verifyToken], getUserDetails)
     userauth.put('/api/me/:id', [ verifyToken, EmailIsPassword], updateDetails );
     userauth.get('/api/products/all-products', getAllProducts);
     userauth.put('/api/me/:id/:productid/add', [ verifyToken], userAddToCart );
     userauth.delete('/api/me/:id/:productid/remove', [ verifyToken], userRemoveFromCart );
     userauth.put('/api/me/:id/:productid/update-wish', [ verifyToken], userAddToWish );
     userauth.put('/api/me/:id/place-order', [ verifyToken], userPlaceOrder );

  }


