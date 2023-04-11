require('dotenv').config();
const express = require('express');
const app = express();

//Import the database.js file
const { main } = require('./src/database/database');
const authRouter = require('./src/routes/authentication_router');
const postsRouter = require('./src/routes/posts_router');
app.use('/', authRouter);
app.use('/posts', postsRouter);

//Call the main() function to establish the database connection
//Fetch documents from the MongoDB collection
main()
  .then(() => {
    console.log('Database connection established successfully');
    // Start your server here
    app.listen(3000, () => {
      console.log('Server is running on http://localhost:3000');
    });
  })
  .catch((error) => {
    console.error('Failed to establish database connection:', error);
  });