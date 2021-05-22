/* eslint-disable no-console */
const Server = require('../src/server');

const BookShelfApp = new Server();
BookShelfApp.start();

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});
