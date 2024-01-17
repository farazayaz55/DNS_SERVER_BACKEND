const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
// const dgram = require('dgram');

// const udpserver = dgram.createSocket('udp4');
// udpserver.on('message', (msg, rinfo) => {
  // Handle the incoming UDP packet, e.g., log or modify the content
  // console.log(`Received UDP message from ${rinfo.address}:${rinfo.port}: ${msg}`);

  // Forward the UDP packet to the destination server
  // const destinationServer = '123.456.789';
  // const destinationPort = 12345; // Replace with the actual destination port
  // const client = dgram.createSocket('udp4');
  // client.send(msg, 0, msg.length, destinationPort, destinationServer, (err) => {
      // client.close();
  // });
// });

// udpserver.on('listening', () => {
//   const address = server.address();
//   console.log(`UDP server listening ${address.address}:${address.port}`);
// });

// udpserver.bind(9876);

const app = express();

// Create a proxy middleware for all paths
const proxy = createProxyMiddleware({
  target: 'https://www.google.com',  
  changeOrigin: true,
});

// Use the proxy middleware for all requests
app.use('*', (req, res, next) => {
  // Override the target based on the host header (original domain)
  proxy.target = `https://${req.headers.host}`;
  proxy(req, res, next);
});

// Start the Express server on port 4000
const port = 80;//http port
app.listen(port, () => {
  console.log(`Proxy server listening on port ${port}`);
});
