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

const addFollow = async (req, res) => {
    const loggedInUser = req.user.username;
    const followUser = req.query.username;
  
    try {
      const db = await connect();
      const usersCollection = db.collection('users');
      const followCollection = db.collection('follow');
  
      //Check if the user exists in the users collection.
      const userExists = await usersCollection.findOne({ username: followUser });
      if (!userExists) {
        return res.status(400).json({ error: 'User does not exist' });
      }
  
      //Check if the logged in user is already following the user.
      const alreadyFollowing = await followCollection.findOne({ username: followUser, follower: loggedInUser });
      if (alreadyFollowing) {
        return res.status(400).json({ error: 'Already following this user' });
      }
  
      //Add the follow to the follow coll.
      await followCollection.insertOne({ username: followUser, follower: loggedInUser });
      res.status(200).json({ message: `You are now following ${followUser}` });
    } catch (err) {
      console.log(err);
      res.status(500).json('Error connecting to MongoDB');
    }
  };
  
  module.exports = {
    addFollow
  };  