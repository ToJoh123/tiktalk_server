const dotenv = require('dotenv');
dotenv.config();

const protectedPage = async (req, res) => {
    const loggedInUser = req.user.username;
  
    if (!loggedInUser) {
        return res.status(401).send('Invalid token');
    } else {
        return res.status(201).send('Valid token');
    }
};

module.exports = {
    protectedPage
};