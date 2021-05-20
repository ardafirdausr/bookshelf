const NanoID = require('nanoid');
const Joi = require('joi');

const JSONDB = require('../database/json');

const Schema = Joi.object({
  name: Joi.string()
    .alter({
      search: (schema) => schema.optional(),
      create: (schema) => schema.required(),
      update: (schema) => schema.required(),
    })
    .messages({
      'any.required': 'Mohon isi nama buku',
    }),
  year: Joi.number()
    .alter({
      create: (schema) => schema.required(),
      update: (schema) => schema.optional(),
    })
    .messages({
      'any.required': 'Mohon isi tahun buku',
    }),
  author: Joi.string()
    .alter({
      create: (schema) => schema.required(),
      update: (schema) => schema.optional(),
    })
    .messages({
      'any.required': 'Mohon isi penulis buku',
    }),
  summary: Joi.string()
    .alter({
      create: (schema) => schema.required(),
      update: (schema) => schema.optional(),
    })
    .messages({
      'any.required': 'Mohon isi ringkasan buku',
    }),
  publisher: Joi.string()
    .alter({
      create: (schema) => schema.required(),
      update: (schema) => schema.optional(),
    })
    .messages({
      'any.required': 'Mohon isi penerbit buku',
    }),
  pageCount: Joi.number()
    .alter({
      create: (schema) => schema.required(),
      update: (schema) => schema.optional(),
    })
    .messages({
      'any.required': 'Mohon isi jumlah halaman buku',
    }),
  readPage: Joi.number()
    .alter({
      create: (schema) => schema.required(),
      update: (schema) => schema.optional(),
    })
    .max(Joi.ref('pageCount'))
    .messages({
      'any.required': 'Mohon isi halaman yang sedang dibaca',
      'number.max': 'readPage tidak boleh lebih besar dari pageCount',
    }),
  reading: Joi.boolean().truthy(1, '1').falsy(0, '0')
    .alter({
      search: (schema) => schema.optional(),
      create: (schema) => schema.required(),
      update: (schema) => schema.optional(),
    })
    .messages({
      'any.required': 'Mohon isi status baca buku',
    }),
  finished: Joi.boolean().truthy(1, '1').falsy(0, '0')
    .alter({
      search: (schema) => schema.optional(),
      create: (schema) => schema.forbidden(),
      update: (schema) => schema.forbidden(),
    })
    .messages({
      'any.forbidden': 'Tidak boleh mengisi field ini',
    }),
});

const getAll = (filters = {}) => {
  // shorthand: db.get(str).filter(func|obj).map(func).value()
  const books = JSONDB.get('books').value();
  const filteredBooks = books.filter((book) => {
    let isMatch = true;
    if (filters.name !== undefined) {
      const pattern = new RegExp(`.*${filters.name}.*`, 'i');
      isMatch = isMatch && pattern.test(book.name);
    }

    if (filters.reading !== undefined) {
      isMatch = isMatch && (book.reading === filters.reading);
    }

    if (filters.finished !== undefined) {
      isMatch = isMatch && (book.finished === filters.finished);
    }
    return isMatch;
  });
  const formatedBooks = filteredBooks.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));
  return formatedBooks;
};

const find = (bookId) => JSONDB.get('books')
  .find({ id: bookId })
  .value();

const create = (createBookParam) => {
  const book = {
    ...createBookParam,
    id: NanoID.nanoid(),
    finished: createBookParam.readPage === createBookParam.pageCount,
    insertedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  JSONDB.get('books')
    .push(book)
    .write();
  return book;
};

const updateById = (bookId, updateBookParam) => {
  const book = {
    ...updateBookParam,
    finished: updateBookParam.readPage === updateBookParam.pageCount,
    updatedAt: new Date().toISOString(),
  };
  return JSONDB.get('books')
    .find({ id: bookId })
    .assign(book)
    .write();
};

const deleteById = (bookId) => JSONDB.get('books')
  .remove({ id: bookId })
  .write();

module.exports = {
  Schema,
  getAll,
  find,
  create,
  updateById,
  deleteById,
};
