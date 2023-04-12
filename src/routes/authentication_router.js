const express = require('express');
const authRouter = express.Router();
const { MongoClient } = require('mongodb');

//Middleware to parse JSON request bodies.
authRouter.use(express.json());

//Bcrypt.
const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of salt rounds for bcrypt

//Register function.
const register = async (req, res) => {
  try {
    // Extract user data from request body
    const { username, password } = req.body;

    // Connect to MongoDB
    const url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.smsizof.mongodb.net/?retryWrites=true&w=majority`;
    const connection = await MongoClient.connect(url);
    const database = connection.db('test');
    const coll = database.collection('test');

    //Check if user already exists.
    const existingUser = await coll.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    //Hash the password.
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    //Insert new user into database.
    const newUser = { username, password: hashedPassword };
    await coll.insertOne(newUser);

    //Success.
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    //Error handeling.
    console.error('Error in register function:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
  
//Login function.
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    //Connect to MongoDB.
    const url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.smsizof.mongodb.net/?retryWrites=true&w=majority`;
    const connection = await MongoClient.connect(url);
    const database = connection.db('test');
    const coll = database.collection('test');

    // Find the user in the MongoDB collection by username
    const user = await coll.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Compare the password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      //Passwords match and user should be sent to the feed page.
      return res.status(200).json({ message: 'Login successful' });
    } else {
      //Passwords do not match, user is not authenticated. Display an error.
      return res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (err) {
    //Error handeling.
    console.error('Error in login function:', err);
    res.status(500).send('Error logging in');
  }
};
  
  //Logout function.
  const logout = (req, res) => {
    //Remove a JWT here.
    res.send('Logout function called');
  };

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/logout', logout);


module.exports = authRouter;


