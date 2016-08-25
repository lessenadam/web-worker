var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'new_task_queue';
    var msg = process.argv.slice(2).join(' ') || "http://empty.com";
    ch.prefetch(1);
    ch.assertQueue(q, {durable: true});
    ch.sendToQueue(q, Buffer.from(msg), {persistent: true});
    console.log(" [x] Sent '%s'", msg);
  });
  setTimeout(function() { conn.close(); process.exit(0) }, 500);
});