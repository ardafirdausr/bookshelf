const Book = require('../models/book');

const getAllBooks = {
  method: 'GET',
  path: '/books',
  handler: (_request, h) => {
    const books = Book.getAll();
    const payload = {
      status: 'success',
      message: 'Berhasil',
      data: books,
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
      options: {
        allowUnknown: true,
        abortEarly: false,
      },
      failAction: (_request, h, err) => {
        const firstError = err.details[0].message.replace(/['"]+/g, '');
        const payload = {
          status: 'fail',
          message: `Gagal menambahkan buku. ${firstError}`,
        };
        return h.response(payload)
          .code(400)
          .takeover();
      },
    },
  },
  handler: (request, h) => {
    const data = request.payload;
    const book = Book.create(data);
    const payload = {
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: { book },
    };
    return h.response(payload).code(200);
  },
};

module.exports = [
  getAllBooks,
  createBook,
];
