const express = require("express");
const { countFollowers } = require("../controllers/social/countFollowers");
const { getFollows } = require("../controllers/social/getFollows");
const { addFollow } = require("../controllers/social/addFollow");
const { getUsers } = require("../controllers/social/getUsers");
const { getProfileInfo } = require("../controllers/social/getProfileController");

const socialRouter = express.Router();
socialRouter.get("/count", countFollowers); //Count number of follows and following.
socialRouter.get("/follows", getFollows); //Get the username of followers and the following accounts.
socialRouter.post("/add", addFollow); //Follow another account.
socialRouter.get("/users", getUsers); //Get all users that is registered and render out the accounts you follow and not follow.
socialRouter.get("/globalProfile", getProfileInfo); //Use a new router for this.

module.exports = socialRouter;
