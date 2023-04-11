const express = require('express');
const authRouter = express.Router();

// Register function
const register = (req, res) => {
    // Implement your registration logic here
    res.send('Register function called');
  };
  
  // Login function
  const login = (req, res) => {
    // Implement your login logic here
    res.send('Login function called');
  };
  
  // Logout function
  const logout = (req, res) => {
    // Implement your logout logic here
    res.send('Logout function called');
  };

authRouter.post('/register', register);
authRouter.get('/login', login);
authRouter.get('/logout', logout);


module.exports = authRouter;


