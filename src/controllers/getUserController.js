const jwt = require("jsonwebtoken");

const getUserInfo = (req, res) => {
  try {
    // Extract the token from the "Authorization" header
    const token = req.headers.authorization.split(" ")[1];

    // Verify the JWT token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      // Send the user data to the client in the expected format
      res.status(200).json({
        fullname: decoded.fullname,
        username: decoded.username,
      });
    } catch (error) {
      // Handle JWT verification errors
      if (error instanceof jwt.JsonWebTokenError) {
        res.status(401).json({ message: "Invalid token" });
      } else {
        // Handle other errors
        console.error("Error in getUserInfo function:", error);
        res.status(500).json({ message: "An error occurred while processing the request" });
      }
    }
  } catch (error) {
    console.error("Error in getUserInfo function:", error);
    res.status(400).json({ message: "Bad request" });
  }
};

module.exports = {
  getUserInfo,
};