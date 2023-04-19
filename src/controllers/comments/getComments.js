const db = require("../../database/db");

exports.getComments = async function (req, res) {
  try {
    const data = await db.comments.find({}).toArray();
    res
      .status(200)
      .json({ message: "this is getComments function at /comments", data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
