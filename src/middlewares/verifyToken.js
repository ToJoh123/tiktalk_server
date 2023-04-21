const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const secret = process.env.JWT_SECRET_KEY;

const verifyToken = function verifyToken(req, res, next) {
  try {
    let jwtToken = req.cookies.jwt;
    if (!jwtToken) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        jwtToken = authHeader.split(' ')[1];
      }
    }

    if (!jwtToken) {
      res.status(401).json('Token not found');
      return;
    }

    jwt.verify(jwtToken, secret, (error, loggedInUserToken) => {
      if (error) {
        res.status(401).json('Authentication error: ' + error.message);
        return;
      }
      req.user = loggedInUserToken;
      next();
    });
  } catch (error) {
    res.status(401).json('Authentication error: ' + error.message);
  }
};

module.exports = verifyToken;