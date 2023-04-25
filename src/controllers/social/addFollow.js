const dotenv = require("dotenv");
dotenv.config();

const db = require("../../database/db"); 

const addFollow = async (req, res) => {
  const loggedInUser = req.user.username;
  const followUser = req.query.username;

  try {
    const usersCollection = db.users; // renamed from db.collection("users");
    const followCollection = db.follow; // renamed from db.collection("follow");

    //Check if the user exists in the users collection.
    const userExists = await usersCollection.findOne({ username: followUser });
    if (!userExists) {
      return res.status(400).json({ error: "User does not exist" });
    }

    //Check if the logged in user is already following the user.
    const alreadyFollowing = await followCollection.findOne({
      username: followUser,
      follower: loggedInUser,
    });
    if (alreadyFollowing) {
      return res.status(400).json({ error: "Already following this user" });
    }

    //Add the follow to the follow coll.
    await followCollection.insertOne({
      username: followUser,
      follower: loggedInUser,
    });
    res.status(200).json({ message: `You are now following ${followUser}` });
  } catch (err) {
    console.error("Error in addFollow:", err);
    res.status(500).json({
      message: "An error occurred while processing the request",
      error: err.message || "Unknown error",
    });
  }
};

module.exports = {
  addFollow,
};
