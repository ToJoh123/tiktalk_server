require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser"); // Require cookie-parse
const app = express();

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
const verifyToken = require("./src/routes/middlewares/verifyToken");
const postsRouter = require("./src/routes/posts_router");
app.use("/", authRouter);
app.use("/posts", verifyToken, postsRouter);

// Call the main() function to establish the database connection.
main()
  .then(() => {
    console.log("please delete me at server.js");
    console.log("Database connection established successfully");
    // Start your server here
    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  })
  .catch((error) => {
    console.error("Failed to establish database connection:", error);
  });

module.exports = app; // Export the app instance
