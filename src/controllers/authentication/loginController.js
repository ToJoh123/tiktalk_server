const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
const { loginSchema } = require('../../validation/loginschema'); // Import the JOI schema

//Jwt.
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();


//login function.
const login = async (req, res) => {
  try {
    //Validate request body against loginSchema. This will done before we query the database.
    const { error, value } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { username, password } = value;

    // Compare the password with the stored hashed password.
    let user = null;
    try {
      // Connect to MongoDB.
      const url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.smsizof.mongodb.net/?retryWrites=true&w=majority`;
      const connection = await MongoClient.connect(url);
      const database = connection.db("test");
      const coll = database.collection("users");

      // Find the user in the MongoDB collection by username.
      user = await coll.findOne({ username });

      // Close the connection to MongoDB.
      connection.close();
    } catch (err) {
      console.error("Error connecting to MongoDB:", err);
      return res.status(500).json({ message: "Error connecting to database" });
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const copyOfUser = { ...user };
    delete copyOfUser.password; // Delete the password from the user object before sending it to the client.

    // Generate JWT token
    const token = jwt.sign(
      {
        copyOfUser,
        _id: copyOfUser._id,
        username: copyOfUser.username,
        fullname: `${copyOfUser.firstname} ${copyOfUser.surname}`,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: 60*30,
      }
    );
    res.cookie("jwt", token, {
      httpOnly: false,
      sameSite: "none",
      secure: false,
      maxAge: 360000 * 30,
    });

    // Return the JWT token as part of the response
    return res.status(200).send({ token, message: "Login successful" });
  } catch (err) {
    console.error("Error in login function:", err);
    return res.status(500).send("Error logging in");
  }
};

module.exports = {
  login,
};