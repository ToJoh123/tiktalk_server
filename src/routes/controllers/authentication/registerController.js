const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of salt rounds for bcrypt

//Register function.
const register = async (req, res) => {
  try {
    // Extract user data from request body
    const { firstname, surname, username, password } = req.body;

    // Connect to MongoDB
    const url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.smsizof.mongodb.net/?retryWrites=true&w=majority`;
    const connection = await MongoClient.connect(url);
    const database = connection.db('test');
    const coll = database.collection('users');

    //Check if user already exists.
    const existingUser = await coll.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    //Hash the password.
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    //Insert new user into database.
    const newUser = { firstname, surname, username, password: hashedPassword };
    await coll.insertOne(newUser);

    //Success.
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    //Error handeling.
    console.error('Error in register function:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  register
};