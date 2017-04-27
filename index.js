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

  toSocket.on('end', () => {
    console.log('Server disconnected');
  });
});

server.listen(config.from.port, () => {
  console.log('Reverse proxy');
  console.log(config.from.host + ':' + config.from.port +
    ' -> ' + config.to.host + ':' + config.to.port);
});