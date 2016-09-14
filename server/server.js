const express = require('express');
const middleware = require('./middleware');
const routeHandler = require('./route-handler');
const userAuth = require('./login-handler');
const path = require('path');

const app = express();
const html_dir = path.join(__dirname, '/..', 'public')

middleware(app);

app.post('/api/addUrl', routeHandler.addUrl);

app.get('/api/checkId', routeHandler.checkJobId);

app.get('/portal', (req, res) => {
  res.sendFile(`${html_dir}/portal.html`);
});

app.get('*', function (req, res) {
  res.redirect('/');
});

app.post('/login', userAuth.handleLogin);

app.listen(3000, function () {
  console.log('web-worker listening on port 3000!');
});
