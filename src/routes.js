const bookController = require('./controllers/book');

// API /books
function registerBookRoutes(server) {
  server.route(bookController);
}

module.exports = registerBookRoutes;
