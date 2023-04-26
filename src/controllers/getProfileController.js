const db = require("../database/db"); 

const getProfileInfo = async (req, res) => {
  const profileName = req.query.username;
  try {
    const data = await db.users.find({ username: profileName }).toArray();
    if(data.length == 0)
    {
      return res.status(400).json({ error: "User does not exist" });
    }
    const userPosts = await db.comments.find({ username: profileName }).toArray();
    res.status(200).json({
      message: "this is getCurrentUserComments function at /comments/user",
      data,
      userPosts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getProfileInfo,
};