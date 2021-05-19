/* eslint-disable no-console */
const Hapi = require('@hapi/hapi');
const appConfig = require('./config/app');
const initAPIRoutes = require('./routes');

const init = async () => {
  const server = Hapi.server({
    host: appConfig.host,
    port: appConfig.port,
  });

  initAPIRoutes(server);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
