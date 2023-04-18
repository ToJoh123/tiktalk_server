const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");

//Jwt.
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const secretKey = process.env.JWT_SECRET_KEY;

//Login function.
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    //Connect to MongoDB.
    const url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.smsizof.mongodb.net/?retryWrites=true&w=majority`;
    const connection = await MongoClient.connect(url);
    const database = connection.db("test");
    const coll = database.collection("users");

    //Find the user in the MongoDB collection by username.
    const user = await coll.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    //Compare the password with the stored hashed password.
    const passwordMatch = await bcrypt.compare(password, user.password);

    // Login successful.
    if (passwordMatch) {
      const copyOfUser = { ...user };
      delete copyOfUser.password; //Delete the password from the user object before sending it to the client.

      //Generate JWT token
      const token = jwt.sign(copyOfUser, secretKey, {
        expiresIn: 120,
      });
      res.cookie("jwt", token, {
        httpOnly: false,
        sameSite: "none",
        secure: false,
        maxAge: 360000 * 15,
      });

      // Return the JWT token as part of the response
      return res.status(200).send({ token, message: "Login successful" });
    } else {
      //Passwords do not match, user is not authenticated. Display an error.
      return res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (err) {
    //Error handeling.
    console.error("Error in login function:", err);
    res.status(500).send("Error logging in");
  }
};

module.exports = {
  login,
};
