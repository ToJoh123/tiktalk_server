const jwt = require("jsonwebtoken");

const getUserInfo = (req, res) => {
  try {
    // Extract the token from the "Authorization" header
    const token = req.headers.authorization.split(" ")[1];
  } catch (error) {
    console.error("Error in getUserInfo function:", error);
    res.status(400).json({ message: "Bad request" });
  }
};

module.exports = {
  getUserInfo,
};