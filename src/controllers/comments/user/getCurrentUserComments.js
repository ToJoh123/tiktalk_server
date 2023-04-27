joi = require("joi");
const dotenv = require("dotenv");
dotenv.config();

const db = require("../../../database/db");
const jwt = require("jsonwebtoken");
const Schema = joi.object({
  username: joi.string().min(3).max(30),
});
exports.getCurrentUserComments = async function (req, res) {
  //validate the input
  const { error } = Schema.validate(req.query);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  // validation 🍪🚩
  const decoded = jwt.decode(req.cookies.jwt);
  if (!decoded) {
    return res.status(401).json({ message: "Invalid token" });
  }
  const usernameFromCookie = decoded.username;
  const userNameFromURL = req.query.username;
  const username = userNameFromURL || usernameFromCookie;
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
