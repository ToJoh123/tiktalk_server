const express = require("express");
const { countFollowers } = require("../controllers/follow/countFollowers");
const { getFollows } = require("../controllers/follow/getFollows");
const { addFollow } = require("../controllers/follow/addFollow");

const followRouter = express.Router();
//Need to validate the controllers.
followRouter.get("/count", countFollowers);
followRouter.get("/follows", getFollows); //Get followers and the following accounts.
followRouter.get("/add", addFollow); //Get followers and the following accounts.

module.exports = followRouter;
