const NanoID = require('nanoid');
const Joi = require('joi');

const JSONDB = require('../database/json');

const Schema = Joi.object({
  name: Joi.string()
    .alter({
      create: (schema) => schema.required(),
      update: (schema) => schema.optional(),
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
  reading: Joi.boolean()
    .alter({
      create: (schema) => schema.required(),
      update: (schema) => schema.optional(),
    })
    .messages({
      'any.required': 'Mohon isi status baca buku',
    }),
});

const getAll = () => JSONDB.get('books')
  .map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }))
  .value();

const find = (bookId) => JSONDB.get('books')
  .find({ id: bookId })
  .value();

const create = (createBookParam) => {
  const book = {
    ...createBookParam,
    id: NanoID.nanoid(),
    finished: createBookParam.readPage === createBookParam.pageCount,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  JSONDB.get('books')
    .push(book)
    .write();
  return book;
};

module.exports = {
  Schema,
  getAll,
  find,
  create,
};
