const Website = require('./db/db-config');
const childProcess = require('child_process');

/* Create 10 worker process */
for (let i = 0; i < 10; i++) {
  const ls = childProcess.spawn('node', ['server/worker.js', i]);
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

/* Helper for route handler*/
const sendResponse = function (res, obj, status) {
  status = status || 200;
  res.writeHead(status, { 'Content-Type': 'text/html' });
  res.end(obj);
};

/* Export the route handler */

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
          const ls = childProcess.exec(
            'node server/sender.js ' + website.fullUrl,
            function (error, stdout, stderr) {
              if (error) {
                console.log(error.stack);
                console.log('Error code: ' + error.code);
                console.log('Signal received: ' + error.signal);
              }
              console.log('stdout: ' + stdout);
              console.log('stderr: ' + stderr);
            });
          ls.on('exit', function (code) {
            console.log('Child process exited with exit code ' + code);
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
          '<h2>Your site is still being indexed. Please check back soon!<h2>';
        sendResponse(res, payload);
      }
    });
  },
};
