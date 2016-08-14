const logger = require('morgan');
const bodyParser = require('body-parser');

module.exports = function middleware(app) {
  app.use(logger('dev'));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
};
