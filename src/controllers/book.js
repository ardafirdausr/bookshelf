const Book = require('../models/book');

const getAllBooks = {
  method: 'GET',
  path: '/books',
  handler: (_request, h) => {
    const books = Book.getAll();
    const payload = {
      status: 'success',
      message: 'Berhasil',
      data: { books },
    };
    return h.response(payload).code(200);
  },
};

const createBook = {
  method: 'POST',
  path: '/books',
  options: {
    validate: {
      payload: Book.createBookParam,
      failAction: (_request, h) => {
        const payload = {
          status: 'fail',
          message: 'Gagal menambahkan buku',
        };
        return h.response(payload).code(400).takeover();
      },
    },
  },
  handler: (request, h) => {
    const data = request.payload;
    const book = Book.create(data);
    const payload = {
      status: 'success',
      message: 'Berhasil',
      data: { book },
    };
    return h.response(payload).code(200);
  },
};

module.exports = [
  getAllBooks,
  createBook,
];
