const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const secret = process.env.JWT_SECRET_KEY;

// Middleware to verify JWT token
const verifyToken = function verifyToken(req, res, next) {
  try {
    const jwtToken = req.cookies.jwt || req.headers.authorization.split(' ')[1]; // Update this line to check for the token in both cookies and headers
    if (!jwtToken) {
      res.status(401).json('Token not found');
      return;
    }
    // Verify the token and catch any errors
    jwt.verify(jwtToken, secret, (error, loggedInUserToken) => {
      if (error) {
        res.status(401).json('Authentication error: ' + error.message);
        return;
      }
      // If the token is valid, set the decoded payload to the request object
      req.user = loggedInUserToken;
      next();
    });
  } catch (error) {
    res.status(401).json('Authentication error: ' + error.message);
  }
};

module.exports = verifyToken;