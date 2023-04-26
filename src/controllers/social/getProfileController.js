const db = require("../../database/db"); 
const dotenv = require('dotenv');
dotenv.config();
const joi = require("joi");

const getProfileInfoSchema = joi.object({
  username: joi.string().allow(null, '').min(1).max(150),
});

const getProfileInfo = async (req, res) => {
  const { error } = getProfileInfoSchema.validate(req.query);
  if (error) {
    return res.status(400).json(error.details[0].message);
  }
  const profileName = req.query.username || req.user.username; //If username parameter is not there, use loggedInUser value.
  try {
    const data = await db.users.find({ username: profileName }).toArray();
    if(data.length == 0)
    {
      return res.status(400).json({ error: "User does not exist" });
    }
    const userPosts = await db.comments.find({ username: profileName }).toArray();
    res.status(200).json({
      message: "this is getProfileController /api/profile",
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