const express = require("express");
const { getComments } = require("../controllers/comments/getComments");
const { postComment } = require("../controllers/comments/postComment");

const commentsRouter = express.Router();
commentsRouter.get("/", getComments);
commentsRouter.post("/", postComment);

module.exports = commentsRouter;
