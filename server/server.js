const express = require('express');
const middleware = require('./middleware');
const routeHandler = require('./route-handler');

const app = express();

// console.log('JOINED---------', path.join(__dirname, '/..', 'public'));
// console.log('node trickery for rel paths---------', process.cwd());

middleware(app);

routeHandler(app);


app.listen(3000, function () {
  console.log('web-worker listening on port 3000!');
});