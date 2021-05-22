/* eslint-disable func-names */
/* eslint-disable no-console */
const Hapi = require('@hapi/hapi');
const appConfig = require('./config/app');
const registerBookRoutes = require('./routes');

function Server() {
  this.server = Hapi.server({
    host: appConfig.host,
    port: appConfig.port,
    routes: {
      cors: { origin: ['*'] },
    },
  });

  registerBookRoutes(this.server);
}

Server.prototype.start = async function () {
  await this.server.start();
  console.log('Server running on %s', this.server.info.uri);
};

Server.prototype.stop = async function () {
  await this.server.stop();
  console.log('Server has been stopped');
};

module.exports = Server;
