const path = require('path');
const express = require('express');
const Website = require('./db/db-config');

module.exports = function routeHandlers(app) {

  app.use(express.static(path.join(__dirname, '/..', 'public')));

  app.get('*', function (req, res) {
    res.send('What were you looking for?');
  });

  app.post('*', function (req, res) {
    console.log('body?-------', req.body);
    res.sendStatus(200);
  });

};