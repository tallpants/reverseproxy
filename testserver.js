const http = require('http');

const server = http.createServer((req, res) => {
  console.log('Received request');

  res.write('Test Response');
  res.end();
});

server.listen(8080, () => {
  console.log('Test Server');
  console.log('Listening at localhost:8080');
});