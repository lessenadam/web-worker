/* Process to wake up, send a URL to the queue, and go to sleep */

const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function (err, conn) {
  conn.createChannel(function (err, ch) {
    const q = 'new_task_queue';
    const msg = process.argv.slice(2).join(' ') || 'http://empty.com';// sliceing the fullUrl
    ch.prefetch(1); // only assign job to taskless workers
    ch.assertQueue(q, { durable: true });
    ch.sendToQueue(q, Buffer.from(msg), { persistent: true });
    console.log('Sent %s to the queue', msg);
  });
  setTimeout(function () { conn.close(); process.exit(0); }, 500);
});
