// TODO: Handle servers going down or not responding

const net = require('net');
const fs = require('fs');
let config = null;

if (fs.existsSync('config.json')) {
  const fileContents = fs.readFileSync('config.json');
  config = JSON.parse(fileContents);
}

// TODO: Programmatic configuration

if (!config) {
  console.error('Not configured');
  process.exit(1);
}

let {balanceMode} = config;

let balancer = {};
balancer.num_workers = config.to.length;

if (!balanceMode) {
  balanceMode = 'roundRobin';
}

switch (balanceMode) {
  case 'roundRobin':
    balancer.index = 0;
    break;

  case 'leastConnected':
    balancer.connectionCount = new Array(balancer.num_workers).fill(0);
    break;

  default:
    console.error('Unrecognizable balance mode');
    process.exit(1);
}

const server = net.createServer((fromSocket) => {
  console.log('Client connected');

  let toHost;
  let toPort;

  switch (balanceMode) {

    case 'roundRobin':
      toHost = config.to[balancer.index].host;
      toport = config.to[balancer.index].port;

      if (balancer.index < balancer.num_workers - 1) {
        balancer.index += 1;
      } else {
        balancer.index = 0;
      }

      break;
    
    case 'leastConnected':
      let leastConnectionCount = Math.min.apply(Math, balancer.connectionCount);
      let leastConnectionIndex = balancer.connectionCount.indexOf(leastConnectionCount);

      toHost = config.to[leastConnectionIndex].host;
      toPort = config.to[leastConnectionIndex].port;

      balancer.connectionCount[leastConnectionIndex] += 1;
  }

  const toSocket = net.createConnection({
    host: toHost,
    port: toPort
  });

  fromSocket.pipe(toSocket);
  toSocket.pipe(fromSocket);

  // TODO: Decrement connectionCount in leastConnected balancing mode??
  fromSocket.on('end', () => {
    console.log('Client disconnected');
  });

  toSocket.on('end', () => {
    console.log('Server disconnected');
  });
});

server.listen(config.listenPort, () => {
  console.log('Reverse proxy');
  console.log('Balance mode: ' + balanceMode);
  console.log('Listening at port ' + config.listenPort);
});