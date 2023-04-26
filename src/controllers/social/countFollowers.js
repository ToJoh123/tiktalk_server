const dotenv = require('dotenv');
dotenv.config();
const joi = require("joi");

const db = require("../../database/db"); //Connect.

const countFollowersSchema = joi.object({
  username: joi.string().allow(null, '').min(1).max(150),
});

const countFollowers = async (req, res) => {
  const { error } = countFollowersSchema.validate(req.query);
  if (error) {
    return res.status(400).json(error.details[0].message);
  }
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