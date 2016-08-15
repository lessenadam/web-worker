const logger = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const express = require('express');

module.exports = function middleware(app) {
  app.use(logger('dev'));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(express.static(path.join(__dirname, '/..', 'public')));
};
