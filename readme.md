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
      {
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
      Returns only comments from current or selected user
      using query/URL or set jwt cookie
- [x] .get('/comments/feed')
      Returns only comments from friend list

- [x] .patch('comment/like/:commentId')

stores likes on comments in comment collection.

Socials

- [x] .get('profile/count')
      count follow stats.
- [x] .get('profile/follows')
      Using a url param to get a list of followers and following.
- [x] .post('profile/add')
      /Follow another account.

- [x] get('profile/globalProfile')
      //Get all users that is registered and render out the accounts you follow and not follow.

- [x] get('profile/api/userinfo')
      returns Data->userinfo
      posts->all post of the user

- [x].get(/access/verify)
  An endpoint for the client to fetch to verifyToken.
