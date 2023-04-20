const express = require("express");
const { getComments } = require("../controllers/comments/getComments");
const { postComment } = require("../controllers/comments/postComment");
const { deleteComment } = require("../controllers/comments/deleteComment");
const commentsRouter = express.Router();
commentsRouter.get("/", getComments);
commentsRouter.post("/", postComment);
commentsRouter.delete("/", deleteComment);

module.exports = commentsRouter;
