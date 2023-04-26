const dotenv = require('dotenv');
dotenv.config();

const db = require("../../database/db"); //Connect.

const countFollowers = async (req, res) => {
  const username = req.query.username || req.user.username; //If username parameter is not there, use loggedInUser value.
  try {
    const followCollection = db.follow;
    const followersCount = await followCollection.countDocuments({ username: username }); //Followers.
    const followingCount = await followCollection.countDocuments({ follower: username }); //Following.
    res.status(200).json({ followers: followersCount, following: followingCount });
  } catch (err) {
    res.status(500).json('Error connecting to MongoDB');
  }
};

module.exports = {
  countFollowers
};