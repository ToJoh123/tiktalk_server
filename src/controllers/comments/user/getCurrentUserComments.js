const dotenv = require('dotenv');
dotenv.config();

const db = require("../../../database/db");
const jwt = require("jsonwebtoken");

exports.getCurrentUserComments = async function (req, res) {
  const username = req.query.username || req.user.username;
  try {
    const data = await db.comments.find({ username: username }).toArray();
    res.status(200).json({
      message: "this is getCurrentUserComments function at /comments/user",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
