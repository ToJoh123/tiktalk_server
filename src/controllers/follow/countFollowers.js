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

const countFollowers = async (req, res) => {
  const loggedInUser = req.user.username;

  try {
    const db = await connect();
    const followCollection = db.collection('follow');
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