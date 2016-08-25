# web-worker

## Getting started 

1) Clone down and npm install

` $ npm install `

2) Ensure mongoDB is installed and running

If needing to install: https://docs.mongodb.com/manual/installation/

If needing to start the process

` $ mongod`

3) Ensure rabbitmq server is installed and running

If needing to install: https://www.rabbitmq.com/download.html

If needed to start the process

` $ rabbitmq-server`

4) Start the server using 'npm start' and open localhost:3000 in the browser

` $ npm start `

You will see each of the workers log to the console that they are ready when you first boot up the server. To see the round-robbin nature of the workers, submit multiple URLs to the API. Each worker will log when they recieve a new task from the queue.
