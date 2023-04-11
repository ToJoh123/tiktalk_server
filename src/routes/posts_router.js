const express = require('express');
const postsRouter = express.Router();

postsRouter.post('/add', add);
postsRouter.delete('/delete', deletePost);




module.exports = postsRouter;


