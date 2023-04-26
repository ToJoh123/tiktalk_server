const express = require("express");
const { getComments } = require("../controllers/comments/getComments");
const { postComment } = require("../controllers/comments/postComment");
const { deleteComment } = require("../controllers/comments/deleteComment");
const { getFollowingPosts } = require("../controllers/comments/getFollowingPosts");
const {
  getCurrentUserComments,
} = require("../controllers/comments/user/getCurrentUserComments");
const { patchComment } = require("../controllers/comments/patchComment");
const { likeComment } = require("../controllers/comments/likeComment")

const commentsRouter = express.Router();
commentsRouter.get("/", getComments);
commentsRouter.post("/", postComment);
commentsRouter.delete("/", deleteComment);
commentsRouter.patch("/", patchComment);
commentsRouter.get("/user", getCurrentUserComments);
commentsRouter.get("/feed", getFollowingPosts);
commentsRouter.patch("/like/:commentId", likeComment)

module.exports = commentsRouter;
