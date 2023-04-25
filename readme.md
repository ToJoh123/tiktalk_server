#TikTalk Application

## available endpoints

AuthRouter

- [x] .post('/login')
      {
      username:[username],
      password:[password]
      }

- [x] .post('/register')
- [x] .post('/logout')

Comments

- [x] .get('/comments')
      returns all comments
- [x] .post('/comments')
      {
      "parentId":"insertdata",
      "text":"insertdata"
      }
      post a comment
- [x] .delete('/comments')
- [ ]       {
          "\_id":"insertdata",
          }
          deletes rootComments
          deletes replies
- [x] patch('/comments')
      {
      "\_id":"insertdata",
      "text":"insertdata"
      }
      Edit a comment
- [x] get('/comments/user')
      Returns only comments from current user
- [ ] .get('/comments/followers')
      Returns only comments from friend list

Follows

- [x] .get('/count')
      count follow stats.
- [x] .get('/follow')
      Using a url param to get a list of followers and following.
