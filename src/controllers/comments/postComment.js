const db = require("../../database/db");

const jwt = require("jsonwebtoken"); //🍪
const joi = require("joi"); //validation
const schema = joi.object({
  parentId: joi.string().required().min(1).max(150),
  username: joi.string().required().min(1).max(150),
  name: joi.string().required().min(1).max(150),
  text: joi.string().required().min(1).max(150),
  createdAt: joi.string().required().min(1).max(150),
});
//here we want to get the id from the cookie

exports.postComment = function postComment(req, res) {
  const { error } = schema.validate(req.body); //validation
  if (error) {
    return res.status(400).json(error.details[0].message);
  } //validation

  db.comments.insertOne(req.body);
  //this code will get the id from the cookie
  // const decoded = jwt.decode(req.cookies.jwt);
  console.log("this is postComments function at /comments", req.body);
  res.status(200).json({
    message: `hello user with id: [decoded.id] is postComments function at /comments`,
  });
};
