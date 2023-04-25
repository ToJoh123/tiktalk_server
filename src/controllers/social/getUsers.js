const dotenv = require('dotenv');
dotenv.config();

const db = require("../../database/db");

const getUsers = async (req, res) => {
    const loggedInUser = req.user.username;
  
    try {
      const followCollection = db.follow;
      const usersCollection = db.users;
  
      const users = await usersCollection.find({ username: { $ne: loggedInUser } }).toArray(); //Does not include the loggedInUser.
  
      //Loop through the users array and add isFollowing property to each object(user).
      const updatedUsers = await Promise.all(users.map(async (user) => {
        const isFollowing = await followCollection.findOne({ username: user.username, follower: loggedInUser });
        user.isFollowing = !!isFollowing; //Set the isFollowing property boolean value = true/false
        return user;
      }));
  
      res.status(200).json(updatedUsers);
    } catch (err) {
      console.log(err);
      res.status(500).json('Error connecting to MongoDB');
    }
  };

module.exports = {
  getUsers
};