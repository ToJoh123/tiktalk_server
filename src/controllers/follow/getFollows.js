const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

//Connect.
const url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.smsizof.mongodb.net/?retryWrites=true&w=majority`;
const dbName = 'test';

const connect = async () => {
  const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
  return client.db(dbName);
};

const getFollows = async (req, res) => {
    const loggedInUser = req.user.username;
    const followType = req.query.type; // use req.query instead of req.params
  
    try {
      const db = await connect();
      const followCollection = db.collection('follow');
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