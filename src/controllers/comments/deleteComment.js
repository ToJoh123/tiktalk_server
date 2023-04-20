const db = require("../../database/db");
const { ObjectId } = require("mongodb");

const jwt = require("jsonwebtoken");
const joi = require("joi");
const schema = joi.object({
  _id: joi.string().required().min(1).max(150),
});

async function deleteReplies(id) {
  const result = await db.comments.deleteMany({
    parentId: id,
  });
  return result;
}

exports.deleteComment = async function deleteComment(req, res) {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json(error.details[0].message);
  }

  const decoded = jwt.decode(req.cookies.jwt);
  if (!decoded) {
    return res.status(401).json({ message: "Invalid token" });
  }

  try {
    const comment = await db.comments.findOne({
      _id: new ObjectId(req.body._id),
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId !== decoded._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    //if comment is a parent,Rootcomment kill all children and then delete the root
    if (comment.parentId === null) {
      deletedReplies = await deleteReplies(req.body._id);
      const result = await db.comments.deleteOne({
        _id: new ObjectId(req.body._id),
      });
      return res.status(200).json({
        message: "Comment deleted",
        result: result,
        deletedReplies: deletedReplies,
      });
    }

    const result = await db.comments.deleteOne({
      _id: new ObjectId(req.body._id),
    });

    res.status(200).json({
      message: "Comment deleted",
      result: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
