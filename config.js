const config = {
  from: {
    host: "localhost",
    port: "3000"
  },
  to: [
    {
      host: 'localhost',
      port: '8080'
    },
    {
      host: 'localhost',
      port: '8081'
    }
  ]
};

module.exports = config;