const express = require('express');
const middleware = require('./middleware');
const routeHandler = require('./route-handler');

const app = express();

middleware(app);

app.post('/api/addUrl', routeHandler.addUrl);

app.get('/api/checkId', routeHandler.checkJobId);

app.get('*', function (req, res) {
  res.redirect('/');
});

app.listen(3000, function () {
  console.log('web-worker listening on port 3000!');
});
