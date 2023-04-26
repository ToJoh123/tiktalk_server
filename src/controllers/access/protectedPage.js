const dotenv = require('dotenv');
dotenv.config();

const protectedPage = async (req, res) => {
    // Check if req.user exists
    if (!req.user) {
        return res.status(401).send('Invalid token');
    }
  
  };

module.exports = {
    protectedPage
};