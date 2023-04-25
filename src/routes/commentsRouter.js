const express = require("express");
const { getComments } = require("../controllers/comments/getComments");
const { postComment } = require("../controllers/comments/postComment");
const { deleteComment } = require("../controllers/comments/deleteComment");
const {
  getCurrentUserComments,
} = require("../controllers/comments/user/getCurrentUserComments");
const { patchComment } = require("../controllers/comments/patchComment");

const commentsRouter = express.Router();
commentsRouter.get("/", getComments);
commentsRouter.post("/", postComment);
commentsRouter.delete("/", deleteComment);
commentsRouter.patch("/", patchComment);
commentsRouter.get("/user", getCurrentUserComments);

module.exports = commentsRouter;
