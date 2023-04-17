//Logout function, remove cookie. 
const logout = (req, res) => {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'lax' });
    res.send('Logout successful');
  };

  module.exports = {
    logout
 };