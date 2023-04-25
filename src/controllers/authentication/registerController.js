const bcrypt = require('bcrypt');
const { registerSchema } = require('../../validation/registerschema'); // Import the JOI schema
const db = require("../../database/db"); 
const saltRounds = 10; // Number of salt rounds for bcrypt

//Register function.
const register = async (req, res) => {
  try {
    // Validate request body against userSchema
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Extract user data from validated request body
    const { firstname, surname, username, password } = value;

    const usersCollection = db.users;

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user into database
    const newUser = { firstname, surname, username, password: hashedPassword };
    await usersCollection.insertOne(newUser);

    // Success
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    // Error handling
    console.error('Error in register function:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  register
};