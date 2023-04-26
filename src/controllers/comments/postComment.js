const db = require("../../database/db");

const jwt = require("jsonwebtoken"); //🍪
const joi = require("joi"); //validation
const schema = joi.object({
  parentId: joi.string().min(1).max(150).allow(null), //if they sent no parentid then it will be null
  text: joi.string().required().min(1).max(150),
});
//here we want to get the id from the cookie

const yyyymmddhhmm = (date) => {
  const yyyy = date.getFullYear();
  const mm = date.getMonth() + 1;
  const dd = date.getDate();
  const hh = date.getHours();
  const min = date.getMinutes();
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
};

exports.postComment = async function postComment(req, res) {
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
  //💌
  const comment = {
    parentId: req.body.parentId,
    text: req.body.text,
    createdAt: yyyymmddhhmm(new Date()),
    userId: decoded._id,
    username: decoded.username,
    likes: [],
  };

  try {
    const result = await db.comments.insertOne(comment);
    //✔️
    res.status(200).json({
      message: "success in postComment function at /comments",
      result: result,
    });
  } catch (err) {
    //🚩
    console.log("error in postComment function at /comments", err);
    res
      .status(500)
      .json({ message: "error in postComment function at /comments" });
  }
};
