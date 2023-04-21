#TikTalk Application

## available endpoints

AuthRouter

- [x] .post('/login')
- [x] .post('/register')
- [x] .post('/logout')

Comments

- [x] .get('/comments')
      returns all comments
- [x] .post('/comments')
      post a comment
- [x] .delete('/comments')
      deletes rootComments
      deletes replies
- [ ] patch('/comments')
      Edit a comment
- [ ] .get('/comments/followers')
      Returns only comments from friend list

Follows

- [x] .get('/count')
      count follow stats.
- [x] .get('/follow')
      Using a url param to get a list of followers and following.