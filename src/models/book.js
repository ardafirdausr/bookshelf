const NanoID = require('nanoid');
const Joi = require('joi');

const JSONDB = require('../database/json');

const createBookParam = Joi.object({
  name: Joi.string()
    .required()
    .messages({
      'any.required': 'Mohon isi nama buku',
    }),
  year: Joi.number()
    .required()
    .messages({
      'any.required': 'Mohon isi tahun buku',
    }),
  author: Joi.string()
    .required()
    .messages({
      'any.required': 'Mohon isi penulis buku',
    }),
  summary: Joi.string()
    .required()
    .messages({
      'any.required': 'Mohon isi ringkasan buku',
    }),
  publisher: Joi.string()
    .required()
    .messages({
      'any.required': 'Mohon isi penerbit buku',
    }),
  pageCount: Joi.number()
    .required()
    .messages({
      'any.required': 'Mohon isi jumlah halaman buku',
    }),
  readPage: Joi.number()
    .optional()
    .max(Joi.ref('pageCount'))
    .messages({
      'any.required': 'Mohon isi halaman yang sedang dibaca',
      'number.max': 'readPage tidak boleh lebih besar dari pageCount',
    }),
  reading: Joi.boolean().default(false),
});

const getAll = () => {
  const books = JSONDB.read('books')
    .map('name')
    .value();
  return books;
};

const create = (param) => {
  const book = {
    ...param,
    id: NanoID.nanoid(),
    finished: param.readPage === param.pageCount,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  JSONDB.get('books')
    .push(book)
    .write();
  return book;
};

module.exports = {
  createBookParam,
  getAll,
  create,
};
