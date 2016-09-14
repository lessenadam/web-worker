module.exports = {
  handleLogin: function(req, res) {
    // get the username for now as validation
    const {username} = req.body;
    // set the cookies and headers

    // respond and redirect to portal.html
    res.redirect('/portal');
  }
}