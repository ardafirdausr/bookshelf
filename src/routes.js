const BookController = require('./controllers/book');

// API /books
function registerBookRoutes(server) {
  // GetAllBooks
  // GET /books
  server.route(BookController.getAllBooks);
  // Get book detail
  // GET /books/{bookId}
  server.route(BookController.findBook);
  // Create a book
  // POST /books
  server.route(BookController.createBook);
  // Update book data
  // PUT /books/{bookId}
  server.route(BookController.updateBook);
  // Delete book data
  // DELETE /books/{bookId}
  server.route(BookController.deleteBook);
}

module.exports = registerBookRoutes;
