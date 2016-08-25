/* Each spawned worker can crawl a Url, update the database, and send back an ack to q */

const Website = require('./db/db-config');
const request = require('request');
const amqp = require('amqplib/callback_api');

/* Helper function for the webworker */
const downloadUrl = function (fullUrl, ack, msg) {
  request(fullUrl, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      Website.findOneAndUpdate(
        { fullUrl },
        { $set: { htmlContent: body } },
        { new: true },
        function (err) {
          console.log('Done!');
          if (err) {
            console.log('Something wrong when updating data!', err);
          }
        });
    } else {
      console.log('request error for %s:', fullUrl, error);
      console.log('status code error for %s:', fullUrl, response.statusCode);
    }
    // send back the acknowledgement to the queue
    ack(msg);
  });
};

/* Webworker instructions on how to connect to queue and pull messages */
amqp.connect('amqp://localhost', function (err, conn) {
  conn.createChannel(function (err, ch) {
    const q = 'new_task_queue';
    const i = process.argv[2];
    ch.assertQueue(q, { durable: true });
    console.log(' id:%s worker waiting for messages in %s. To exit press CTRL+C', i, q);
    ch.consume(q, function (msg) {
      const fullUrl = msg.content.toString();
      console.log('Worker %s Received %s', i, fullUrl);
      const confirm = (message) => ch.ack(message);
      downloadUrl(fullUrl, confirm, msg);
    }, { noAck: false });
  });
});
