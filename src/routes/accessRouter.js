const express = require("express");
const { protectedPage } = require("../controllers/access/protectedPage");

const accessRouter = express.Router();
accessRouter.get("/verify", protectedPage); //An endpoint for the client to fetch to verifyToken. 

module.exports = accessRouter;
