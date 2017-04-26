const http = require('http')

http.createServer((req, res) => {
  console.log('Received request')
  res.write('Test Response')
  res.end()
}).listen(8080)