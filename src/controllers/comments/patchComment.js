const db = require("../../database/db");
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken"); //🍪
const joi = require("joi"); //validation
const schema = joi.object({
  _id: joi.string().hex().length(24).required(),
  text: joi.string().required().min(1).max(150),
});
//here we want to get the id from the cookie

exports.patchComment = async function postComment(req, res) {
  // validation 📰🚩
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json(error.details[0].message);
  }
  // validation 🍪🚩
  const decoded = jwt.decode(req.cookies.jwt);
  if (!decoded) {
    return res.status(401).json({ message: "Invalid token" });
  }
  try {
    const commentInfo = await db.comments
      .find({
        _id: new ObjectId(req.body._id),
      })
      .toArray();
    if (commentInfo.length === 0) {
      return res.status(400).json({ message: "No comment with that id" });
    }
    if (commentInfo[0].userId !== decoded._id) {
      return res
        .status(401)
        .json({ message: "You can only edit your own posts" });
    }
    const result = await db.comments.updateOne(
      { _id: new ObjectId(req.body._id) },
      { $set: { text: req.body.text } }
    );
    //✔️
    if (result.modifiedCount === 0) {
      return res.status(400).json({ message: "No changes were made" });
    }
    res.status(200).json({
      message: "success in patchComment function at /comments",
      result: result,
    });
  } catch (err) {
    //🚩
    console.log("error in patchComment function at /comments", err);
    res
      .status(500)
      .json({ message: "error in patchComment function at /comments" });
  }
};
