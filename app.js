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

let balancer = {};

let {balanceMode} = config;

if (!balanceMode) {
  balanceMode = 'roundRobin';
}

if (balanceMode == 'roundRobin') {
  balancer.index = 0;
  balancer.num_workers = config.to.length;
}

switch(balanceMode) {
  case 'roundRobin':
    balancer.index = 0;
    balancer.num_workers = config.to.length;
    break;

  case 'leastConnected':
    
    break;

  default:
    console.error('Unrecognizable balance mode');
    process.exit(1);
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
  console.log('Balance mode: ' + balanceMode);
  console.log('Listening at port ' + config.listenPort);
});