const express = require('express');
const authRouter = express.Router();
const { login } = require('../controllers/authentication/loginController');
const { register } = require('../controllers/authentication/registerController');
const { logout } = require('../controllers/authentication/logoutController');

//Middleware to parse JSON request bodies.
authRouter.use(express.json());

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);


module.exports = authRouter;