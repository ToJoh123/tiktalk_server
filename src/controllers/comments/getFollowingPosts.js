const db = require("../../database/db");

const getFollowingPosts = async (req, res) => {
  const loggedInUser = req.user.username;

  try {
    const followCollection = db.follow;
    const followList = await followCollection.find({ follower: loggedInUser }).toArray(); //Get the list of users the loggedInUser follows

    const users = followList.map((follow) => follow.username); //Maps an array of usernames of the followed users.
    const comments = await db.comments.find({ username: { $in: users } }).toArray(); //Get all posts by the followed users.

    res.status(200).json({ message: "Following posts", data: comments });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error connecting to MongoDB" });
  }
};

module.exports = {
  getFollowingPosts,
};