const dotenv = require('dotenv');
dotenv.config();

const db = require("../../database/db");

const getFollows = async (req, res) => {
    const loggedInUser = req.user.username;
    const followType = req.query.type;
  
    try {
      const followCollection = db.follow; // renamed from db.collection("follow");
      let followList;
  
      if (followType === 'followers') {
        followList = await followCollection.find({ username: loggedInUser }).toArray();
        followList = followList.map((follow) => follow.follower); // return only follower username
      } else if (followType === 'following') {
        followList = await followCollection.find({ follower: loggedInUser }).toArray();
        followList = followList.map((follow) => follow.username); // return only username
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