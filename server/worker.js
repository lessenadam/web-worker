const Website = require('./db/db-config');
const request = require('request');

const downloadUrl = function (fullUrl, cb, msg) {
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
      console.log('request error for %s:', fullUrl, error);
      console.log('status code error for %s:', fullUrl, response.statusCode);
    }
    cb(msg);
    
  });
};

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'new_task_queue';
    var i = process.argv.slice(2).join(' ')

    ch.assertQueue(q, {durable: true});
    console.log(" [*] %s Worker waiting for messages in %s. To exit press CTRL+C", i, q);
    ch.consume(q, function(msg) {
      var fullUrl = msg.content.toString();
      console.log(" worker [%s] Received %s", i, fullUrl);
      var confirm = (msg) => ch.ack(msg);
      downloadUrl(fullUrl, confirm, msg);

    }, {noAck: false});
  });
});