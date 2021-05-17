/* eslint-disable no-console */
const Hapi = require('@hapi/hapi');

const init = async () => {
  const server = Hapi.server({
    port: 8000,
    host: 'localhost',
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      const { name = 'World' } = request.query;
      return h.response(`Hello ${name}`);
    },
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
