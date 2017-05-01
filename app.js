const net = require('net');
const fs = require('fs');
let config = null;

if (fs.existsSync('config.json')) {
  const fileContents = fs.readFileSync('config.json');
  config = JSON.parse(fileContents);
}

if (!config) {
  console.log('config.json not found');
}

let balancer = {};

let {balanceMode} = config;

if (!balanceMode) {
  balanceMode = 'roundRobin';
}

if (balanceMode == 'roundRobin') {
  balancer.index = 0;
  balancer.num_workers = config.to.length;
}

const server = net.createServer((fromSocket) => {
  console.log('Client connected');

  if (balanceMode == 'roundRobin') {

    toSocket = net.createConnection({
      host: config.to[balancer.index].host,
      port: config.to[balancer.index].port
    });

    if (balancer.index < balancer.num_workers - 1) {
      balancer.index += 1;
    } else {
      balancer.index = 0;
    }
  }  

  fromSocket.pipe(toSocket);
  toSocket.pipe(fromSocket);

  fromSocket.on('end', () => {
    console.log('Client disconnected');
  });

  toSocket.on('end', () => {
    console.log('Server disconnected');
  });
});

server.listen(config.listenPort, () => {
  console.log('Reverse proxy');
  console.log('Listening at port ' + config.listenPort);
});