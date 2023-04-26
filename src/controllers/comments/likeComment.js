const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const db = require("../../database/db");
const joi = require("joi");

const likeCommentSchema = joi.object({
  commentId: joi.string().required().min(1).max(150),
});

exports.likeComment = async function likeComment(req, res) {
  const { error } = likeCommentSchema.validate(req.params);
  if (error) {
    return res.status(400).json(error.details[0].message);
  }
  const commentId = req.params.commentId;
  const decoded = jwt.decode(req.cookies.jwt);

  if (!decoded) {
    return res.status(401).json({ message: "Invalid token" });
  }

  try {
    const comment = await db.comments.findOne({ _id: new ObjectId(commentId) });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const userId = decoded._id;
    const likesArray = Array.isArray(comment.likes) ? comment.likes : [];
    const hasLiked = likesArray.includes(userId);

    
    if (hasLiked) {
      // User has already liked the comment, so unlike it
      await db.comments.updateOne(
        { _id: new ObjectId(commentId) },
        { $pull: { likes: userId } }
      );
    } else {
      // User has not liked the comment yet, so like it
      await db.comments.updateOne(
        { _id: new ObjectId(commentId) },
        { $push: { likes: userId } }
      );
    }

    // Fetch the updated comment
    const updatedComment = await db.comments.findOne({ _id: new ObjectId(commentId) });

    res.status(200).json({
      message: hasLiked ? "Comment unliked successfully" : "Comment liked successfully",
      commentId: updatedComment._id,
      numberOfLikes: updatedComment.likes.length,
    });
  } catch (err) {
    console.log("error in likeComment function at /comments/like", err);
    res
      .status(500)
      .json({ message: "error in likeComment function at /comments/like" });
  }
};