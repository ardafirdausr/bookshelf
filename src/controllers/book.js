const Book = require('../models/book');

const getAllBooks = {
  method: 'GET',
  path: '/books',
  handler: (_request, h) => {
    const books = Book.getAll();
    const payload = {
      status: 'success',
      data: { books },
    };
    return h.response(payload).code(200);
  },
};

const findBook = {
  method: 'GET',
  path: '/books/{bookId}',
  handler: (request, h) => {
    const { bookId } = request.params;
    const book = Book.find(bookId);
    if (!book) {
      const payload = {
        status: 'fail',
        message: 'Buku tidak ditemukan',
      };
      return h.response(payload).code(404);
    }

    const payload = {
      status: 'success',
      data: { book },
    };
    return h.response(payload).code(200);
  },
};

const createBook = {
  method: 'POST',
  path: '/books',
  options: {
    validate: {
      payload: Book.Schema.tailor('create'),
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
      data: { bookId: book.id },
    };
    return h.response(payload).code(201);
  },
};

const updateBook = {
  method: 'PUT',
  path: '/books/{bookId}',
  options: {
    validate: {
      payload: Book.Schema.tailor('update'),
      failAction: (_request, h, err) => {
        const firstError = err.details[0].message.replace(/['"]+/g, '');
        const payload = {
          status: 'fail',
          message: `Gagal memperbarui buku. ${firstError}`,
        };
        return h.response(payload)
          .code(400)
          .takeover();
      },
    },
  },
  handler: (request, h) => {
    const { bookId } = request.params;
    const data = request.payload;
    let book = Book.find(bookId);
    if (!book) {
      const payload = {
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      };
      return h.response(payload).code(404);
    }

    book = Book.updateById(bookId, data);
    const payload = {
      status: 'success',
      message: 'Buku berhasil diperbarui',
    };
    return h.response(payload).code(200);
  },
};

const deleteBook = {
  method: 'DELETE',
  path: '/books/{bookId}',
  handler: (request, h) => {
    const { bookId } = request.params;
    const book = Book.find(bookId);
    if (!book) {
      const payload = {
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
      };
      return h.response(payload).code(404);
    }

    Book.deleteById(bookId);
    const payload = {
      status: 'success',
      message: 'Buku berhasil dihapus',
    };
    return h.response(payload).code(200);
  },
};

module.exports = [
  getAllBooks,
  findBook,
  createBook,
  updateBook,
  deleteBook,
];
