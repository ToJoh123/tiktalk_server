const dotenv = require('dotenv');
dotenv.config();
const db = require("../../database/db");

const Joi = require('joi');
//Validate the type it should only query the database with followers or following.
const getFollowsSchema = Joi.object({
  type: Joi.string().valid('followers', 'following').required()
});

const getFollows = async (req, res) => {

  const { error } = getFollowsSchema.validate(req.query);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
    const loggedInUser = req.user.username;
    const followType = req.query.type;
  
    try {
      const followCollection = db.follow;
      let followList;
  
      if (followType === 'followers') {
        followList = await followCollection.find({ username: loggedInUser }).toArray();
        followList = followList.map((follow) => follow.follower); //Return follower username.
      } else if (followType === 'following') {
        followList = await followCollection.find({ follower: loggedInUser }).toArray();
        followList = followList.map((follow) => follow.username); //Return following username.
      } else {
        return res.status(400).json({ error: 'Invalid follow type' });
      }
  
      res.status(200).json(followList);
    } catch (err) {
      console.log(err);
      res.status(500).json('Error connecting to MongoDB');
    }
  };

module.exports = {
  getFollows
};