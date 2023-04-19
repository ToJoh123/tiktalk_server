const db = require("../../database/db");
const { ObjectId } = require("mongodb");

const jwt = require("jsonwebtoken"); //🍪
const joi = require("joi"); //validation🎏
const schema = joi.object({
  _id: joi.string().required().min(1).max(150),
});
//here we want to get the id from the cookie
exports.deleteComment = async function deleteComment(req, res) {
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
    // Get comment
    const comment = await db.comments.findOne({
      _id: new ObjectId(req.body._id),
    });
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    //if the user is not the owner of the comment
    if (comment.userId !== decoded._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    //check if the comment parent is null
    if (comment.parentId === null) {
      //if it is null then delete all the replies
      const result = await db.comments.deleteMany({
        parentId: req.body._id,
      });

      //delete parent comment
      const result2 = await db.comments.deleteOne({
        _id: new ObjectId(req.body._id),
      });
      //if result2 is more than 0 then return success message with the deleted ids
      if (result2.deletedCount > 0) {
        return res.status(200).json({
          message: "RootComment deleted",
          deletedIds: result2.deletedIds,
        });
      }
      //if result is more than 0 then return success message with the deleted ids
      if (result.deletedCount > 0) {
        return res.status(200).json({
          message: "Replies deleted",
          deletedIds: result.deletedIds,
        });
      }
      if (result.deletedCount === 0) {
        return res.status(404).json({
          message:
            "Hello rootComment, i found a comment that matches but i did not delete anything. ain't that weird?! 🤷",
        });
      }
    }

    // Delete comment
    const result = await db.comments.deleteOne({
      _id: new ObjectId(req.body._id),
    });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "already deleted or not found" }); //TODO:check ask team if this should stay
    }

    // Return success message
    res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
