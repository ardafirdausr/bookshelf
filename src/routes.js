const bookController = require('./controllers/book');

function initAPIRoutes(server) {
  server.route(bookController);
}

module.exports = initAPIRoutes;
