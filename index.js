const net = require('net');

const config = require('./config');

const server = net.createServer((fromSocket) => {
  console.log('Client connected');

  const toSocket = net.createConnection({
    host: config.to.host,
    port: config.to.port
  });

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
  console.log(config.from.host + ':' + config.from.port +
    ' -> ' + config.to.host + ':' + config.to.port);
});