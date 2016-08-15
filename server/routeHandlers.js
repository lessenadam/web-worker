const path = require('path');
const express = require('express');
const Website = require('./db/db-config');
const request = require('request');
const url = require('url');
const jobQueue = [];

module.exports = function routeHandlers(app) {

  app.use(express.static(path.join(__dirname, '/..', 'public')));

  app.get('*', function (req, res) {
    res.send('What were you looking for?');
  });

  app.post('*', function (req, res) {
    const fullUrl = req.body.url; // assume it's http://www.google.com
    const shortUrl = url.parse(fullUrl).hostname;
    Website.create({ fullUrl, shortUrl, htmlContent: '' }, function(err, website) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        console.log('website-----', website);
        jobQueue.push(website.fullUrl);
        res.sendStatus(200);
      }
      
    });
  });

};


/* worker to fetch html and update the database */

const downloadUrls = function() {
  if (jobQueue.length > 0) {
    console.log('jobQueue:', jobQueue);
  } else {
    console.log('nothing yet!');
  }
}

setInterval(downloadUrls, 10000);