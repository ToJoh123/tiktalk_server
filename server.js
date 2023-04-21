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

app.use(cookieParser()); // Add cookie-parser middleware

// Import the database.js file
const { main } = require("./src/database/database");
const authRouter = require("./src/routes/authentication_router");
const verifyToken = require("./src/middlewares/verifyToken");
const commentsRouter = require("./src/routes/commentsRouter");
const followRouter = require("./src/routes/followRouter");
app.use("/", authRouter);
app.use("/comments", verifyToken, commentsRouter);
app.use("/profile", verifyToken, followRouter);

// Call the main() function to establish the database connection.
main()
  .then(() => {
    console.log("main():Database connection established successfully");
    // Start your server here
    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  })
  .catch((error) => {
    console.error("Failed to establish database connection:", error);
  });
//new class to handle connections TODO:Replace main() with this class
db.connect();
module.exports = app; // Export the app instance
