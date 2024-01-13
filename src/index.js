const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const dnsServer = require('dns2');
const { Packet } = dnsServer;
const dgram = require('dgram');
const http = require('http');
const { getIpForLocation, connectToVPN, getUserByIP } = require('./dns');
var httpProxy = require('http-proxy');

let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
  var dns_Server = dgram.createSocket('udp4');

  dns_Server.on('message', async (msg, rinfo) => {
    try {
      console.log('Dns REQUEST REACHED');

      const user = await getUserByIP(rinfo.address);

      if (user) {
        if (!user.vpnInstance) {
          // Establish OpenVPN connection using user's configuration
          user.vpnInstance ="Connected";
        }

        const response = Packet.createResponseFromRequest(msg);

        const pkt=Packet.parse(msg)
        // responsePacket.header.qr = 1; // QR bit (Query/Response): 1 for response
        response.answers.push({
          name: pkt.questions[0].name,
          type: Packet.TYPE.A, // Assuming an A record response, change accordingly
          class: Packet.CLASS.IN,
          ttl: 60, // Time to Live
          address: getIpForLocation(user.location) // Replace with the IP of your VPN server
        });
        const message = Buffer.from('Some bytes');

        // Send the DNS response
        dns_Server.send(message,rinfo.port,rinfo.address, (err) => {
          if (err) {
            console.error('Error sending DNS response:', err);
          }
          else{
            console.log("Response sent ",rinfo.address,rinfo.port)
            // dns_Server.close()
          }
        });


        

      } else {
        console.log('User not auth');
      }
    } catch (error) {
      console.error('Error processing DNS request:', error);
    }
  });

  dns_Server.on('error',(err)=>{
    console.log(err)
  })

  dns_Server.bind(53, '0.0.0.0');

  console.log('dns server listening on 53 port for 0.0.0.0');
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
