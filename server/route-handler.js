const Website = require('./db/db-config');
const request = require('request');
var child_process = require('child_process');


const
  fs = require('fs'),
  process = require('child_process');

/*Create 10 worker process*/
for(var i=0; i<10; i++) {
  var ls = process.spawn('node', ['server/worker.js', i]);
  
  ls.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
  });
  
  ls.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });
  
  ls.on('close', function (code) {
    console.log('child process exited with code ' + code);
  });
}

// const jobQueue = [];

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
        const jobIdMessage = 'Your job ID is: ' + website.id;
        res.send(jobIdMessage);
        if (created) {
          // jobQueue.push(website.fullUrl);
          // urlWorkers.running += 1;
          // console.log('urlWorkers running now: ', urlWorkers.running)
          // urlWorkers.task()
          var ls = process.exec('node server/sender.js '+website.fullUrl, function (error, stdout, stderr) {
               if (error) {
                 console.log(error.stack);
                 console.log('Error code: '+error.code);
                 console.log('Signal received: '+error.signal);
               }
               console.log('stdout: ' + stdout);
               console.log('stderr: ' + stderr);
               
             });
            
             ls.on('exit', function (code) {
               console.log('Child process exited with exit code '+code);
             });
        }
      }
    });
  },

  checkJobId: function (req, res) {
    const jobId = req.query.jobId;
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
/* 
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
          } else {
            console.log('%s updated successfully', fullUrl);
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
  console.log('checkUrls is called!');
  console.log('inside running is', urlWorkers.running);
  if (jobQueue.length > 0) {
    while (jobQueue.length > 0) {
      const fullUrl = jobQueue.shift();
      downloadUrl(fullUrl);
    }
  }
  urlWorkers.running -= 1;
};

const urlWorkers = {
  running: 0,
  task: checkUrls
}

*/

