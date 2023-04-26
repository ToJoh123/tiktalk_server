const dotenv = require("dotenv");
dotenv.config();
const db = require("../../database/db"); 
const Joi = require('joi');
//Validate the type it should only query the database with followers or following.
const addFollowSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    "string.alphanum": "Username must contain only letters and numbers",
    "string.min": "Username must be at least {#limit} characters long",
    "string.max": "Username must be at most {#limit} characters long",
    "any.required": "Username is required",
  }),
});

const addFollow = async (req, res) => {
  const { error } = addFollowSchema.validate({ username: req.query.username });
  if (error) 
  {
    return res.status(400).json({ error: error.details[0].message });
  }
  const loggedInUser = req.user.username;
  const followUser = req.query.username;

  try {
    const usersCollection = db.users; // renamed from db.collection("users");
    const followCollection = db.follow; // renamed from db.collection("follow");

    //Check if the user exists in the users collection.
    const userExists = await usersCollection.findOne({ username: followUser });
    if (!userExists) 
    {
      return res.status(400).json({ error: "User does not exist" });
    }

    //Check if the logged in user is already following the user.
    const alreadyFollowing = await followCollection.findOne({
      username: followUser,
      follower: loggedInUser,
    });
    if (alreadyFollowing) 
    {
      return res.status(400).json({ error: "Already following this user" });
    }

    //Prevent users from following their own account.
    if (loggedInUser === followUser) 
    {
      return res.status(400).json({ error: "Cannot follow yourself" });
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
