const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config/config");
const logger = require("./config/logger");
const { getIpForLocation, getUserByIP } = require("./dns");
var dns = require('native-dns');
var dnsserver = dns.createServer();

let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info("Connected to MongoDB");
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });




  dnsserver.on("request", async (request, response) => {
    try {
      console.log("Dns REQUEST REACHED");

      // const user = await getUserByIP(request.address.address);


      //making mock user for any query
      const user={
        email: 'farazayaz55@gmail.com',
        ip: request.address.address,
        location: 'india',
        vpnInstance: null,
      }

      if (user) {
        if (!user.vpnInstance) {
          // Establish OpenVPN connection using user's configuration
          user.vpnInstance = "Connected";
        }
        response.answer.push(dns.A({
          name: request.question[0].name,
          address: getIpForLocation(user.location),
          ttl: 600,
        }));

        response.send();
      } else {
        console.log("User not auth");
      }
    } catch (error) {
      console.error("Error processing DNS request:", error);
    }
  });

  dnsserver.on("error", (err) => {
    console.log(err.stack);
  });

  dnsserver.on("listening", () => {
    console.log("UDP RUNNING");
  });

  dnsserver.serve(53);
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
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

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
