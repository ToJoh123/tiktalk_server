// const jwt = require("jsonwebtoken"); //🍪
// const db = require("../../database/db");
// //here we want to get the id from the cookie
// const data = await db.comments
//   .find({})
//   .toArray()
//   .then((data) => {
//     console.log(data);
//     return data;
//   });
// exports.getComments = function getComments(req, res) {
//   //this code will get the id from the cookie
//   //const decoded = jwt.decode(req.cookies.authToken);

//   //use async to get the data from the database

//   console.log("this is getComments function at /comments", data);
//   res
//     .status(200)
//     .json({ message: "this is getComments function at /comments" });
// };
