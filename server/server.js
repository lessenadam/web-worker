const express = require('express');
const middleware = require('./middleware');
const routeHandlers = require('./routeHandlers');

const app = express();

// console.log('JOINED---------', path.join(__dirname, '/..', 'public'));
// console.log('node trickery for rel paths---------', process.cwd());

middleware(app);

routeHandlers(app);


app.listen(3000, function () {
  console.log('web-worker listening on port 3000!');
});