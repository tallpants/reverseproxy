const net = require('net');

const config = require('./config');

let index = 0;
const num_workers = config.to.length;

const server = net.createServer((fromSocket) => {
  console.log('Client connected');

  const toSocket = net.createConnection({
    host: config.to[index].host,
    port: config.to[index].port
  });

  if (index < num_workers - 1) {
    index += 1;
  } else {
    index = 0;
  }

  fromSocket.pipe(toSocket);
  toSocket.pipe(fromSocket);

  fromSocket.on('end', () => {
    console.log('Client disconnected');
  });

  fromSocket.on('close', () => {
    console.log('Client socket has closed.');
  });

  toSocket.on('end', () => {
    console.log('Server disconnected');
  });

  toSocket.on('close', () => {
    console.log('Server socket has closed.');
  });
});

server.listen(config.from.port, () => {
  console.log('Reverse proxy');
});