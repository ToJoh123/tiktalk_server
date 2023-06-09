require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser"); // Require cookie-parse
const app = express();
const db = require("./src/database/db");

// Cors middleware
app.use(
  cors({
    origin: ["http://localhost:5500", "http://127.0.0.1:5500"],
    credentials: true,
  })
);

app.use(cookieParser()); //Add cookie-parser middleware.

const authRouter = require("./src/routes/authentication_router");
const verifyToken = require("./src/middlewares/verifyToken");
const commentsRouter = require("./src/routes/commentsRouter");
const socialRouter = require("./src/routes/socialRouter");
const accessRouter = require("./src/routes/accessRouter");
app.use("/access", verifyToken, accessRouter); //Security router.
app.use("/", authRouter);
app.use("/comments", verifyToken, commentsRouter);
app.use("/profile", verifyToken, socialRouter);

//new class to handle connections TODO:Replace main() with this class
db.connect().then(() => {
  app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
  });
});
module.exports = app; // Export the app instance
