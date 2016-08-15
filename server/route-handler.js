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

  app.post('/api/addUrl', function (req, res) {
    const fullUrl = req.body.url; // assume it's http://www.google.com
    const shortUrl = url.parse(fullUrl).hostname;
    Website.findOrCreate({ fullUrl }, { shortUrl, htmlContent: '' }, function(err, website) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        console.log('website-----', website);
        jobQueue.push(website.fullUrl);
        res.send(website.id);
      }
    });
  });

  app.post('/api/checkId', function (req, res) {
    const jobId = req.body.jobId; // assume correct number
    Website.findById(jobId, function(err, website) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        const payload = website.htmlContent ||
          '<h1>Your site is still being indexed. Please check back soon!</h1>';
        console.log(payload);
        sendResponse(res, payload);
      }
    });
  });
};

const sendResponse = function (res, obj, status) {
  status = status || 200;
  res.writeHead(status, { 'Content-Type': 'text/html' });
  res.end(obj);
};


/* worker to fetch html and update the database */

const downloadUrl = function (fullUrl) {
  request(fullUrl, function (error, response, body) {
    console.log('error', error);
    if (!error && response.statusCode === 200) {
      // console.log('body is', body); // Show the HTML for the Google homepage.
      Website.findOneAndUpdate(
        { fullUrl },
        { $set: { htmlContent: body } },
        { new: true },
        function (err, doc) {
          if (err) {
            console.log('Something wrong when updating data!');
          }
          console.log('doc', doc);
        });
    }
  });
};

const checkUrls = function () {
  if (jobQueue.length > 0) {
    console.log('jobQueue:', jobQueue);
    while (jobQueue.length > 0) {
      const fullUrl = jobQueue.shift();
      downloadUrl(fullUrl);
    }
  } else {
    console.log('nothing yet!');
  }
};

setInterval(checkUrls, 10000);
