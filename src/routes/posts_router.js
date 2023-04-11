const express = require('express');
const postsRouter = express.Router();

// Add function
const add = (req, res) => {
  // Implement your add post logic here
  res.send('Add function called');
};

// Delete function
const deletePost = (req, res) => {
  // Implement your delete post logic here
  res.send('Delete function called');
};

// Route handlers
postsRouter.get('/add', add);
postsRouter.delete('/delete', deletePost);

// Export the router
module.exports = postsRouter;