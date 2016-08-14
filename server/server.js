const express = require('express');
const path = require('path');

const app = express();

console.log('JOINED---------', path.join(__dirname, '/..', 'public'));
console.log('node trickery for rel paths---------', process.cwd());

const logger = require('morgan');
const bodyParser = require('body-parser');

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(express.static(path.join(__dirname, '/..', 'public')));

app.get('*', function (req, res) {
  res.send('What were you looking for?');
});

app.post('*', function (req, res) {
  console.log('body?-------', req.body);
  res.sendStatus(200);
});

app.listen(3000, function () {
  console.log('web-worker listening on port 3000!');
});