const book = require('../models/book');

function getAllBooks(_request, h) {
  const books = book.all();
  const payload = {
    status: 'success',
    message: 'Berhasil',
    data: { books },
  };
  return h.response(payload).code(200);
}

module.exports = [
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooks,
  },
];
