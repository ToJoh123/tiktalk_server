const dotenv = require('dotenv');
dotenv.config();

const db = require("../../database/db"); //Connect.

const countFollowers = async (req, res) => {
  const loggedInUser = req.user.username; 
  try {
    const followCollection = db.follow; 
    const followersCount = await followCollection.countDocuments({ username: loggedInUser }); //Followers.
    const followingCount = await followCollection.countDocuments({ follower: loggedInUser }); //Following.
    res.status(200).json({ followers: followersCount, following: followingCount });
  } catch (err) {
    res.status(500).json('Error connecting to MongoDB');
  }
};

module.exports = {
  countFollowers
};