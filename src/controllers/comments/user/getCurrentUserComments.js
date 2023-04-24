const db = require("../../../database/db");
const jwt = require("jsonwebtoken");

exports.getCurrentUserComments = async function (req, res) {
  const decoded = jwt.decode(req.cookies.jwt);
  console.log("decoded", decoded);
  try {
    const data = await db.comments.find({ userId: decoded._id }).toArray();
    res.status(200).json({
      message: "this is getCurrentUserComments function at /comments/user",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
