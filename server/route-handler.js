const Website = require('./db/db-config');
const request = require('request');

const jobQueue = [];

/* helper function for route handler */

const sendResponse = function (res, obj, status) {
  status = status || 200;
  res.writeHead(status, { 'Content-Type': 'text/html' });
  res.end(obj);
};

/* export the route handler */

module.exports = {
  addUrl: function (req, res) {
    const fullUrl = req.body.url; // assume it's http://www.google.com
    Website.findOrCreate({ fullUrl }, { htmlContent: '' }, function (err, website, created) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        if (created) {
          jobQueue.push(website.fullUrl);
        }
        const jobIdMessage = 'Your job ID is: ' + website.id;
        res.send(jobIdMessage);
      }
    });
  },

  checkJobId: function (req, res) {
    const jobId = req.body.jobId; // assume correct number
    Website.findById(jobId, function (err, website) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        const payload = website.htmlContent ||
          '<span>Your site is still being indexed. Please check back soon!<span>';
        sendResponse(res, payload);
      }
    });
  },
};


/* worker to fetch html and update the database */

const downloadUrl = function (fullUrl) {
  request(fullUrl, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      Website.findOneAndUpdate(
        { fullUrl },
        { $set: { htmlContent: body } },
        { new: true },
        function (err) {
          if (err) {
            console.log('Something wrong when updating data!', err);
          }
        });
    } else {
      response = response || { statusCode: undefined };
      console.log('request error for %s:', fullUrl, error);
      console.log('status code error for %s:', fullUrl, response.statusCode);
    }
  });
};

const checkUrls = function () {
  if (jobQueue.length > 0) {
    while (jobQueue.length > 0) {
      const fullUrl = jobQueue.shift();
      downloadUrl(fullUrl);
    }
  }
};

setInterval(checkUrls, 10000);
