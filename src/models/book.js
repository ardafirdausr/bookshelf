const NanoID = require('nanoid');
const Joi = require('joi');

const JSONDB = require('../database/json');

const createBookParam = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
  author: Joi.string().required(),
  summary: Joi.string().required(),
  publisher: Joi.string().required(),
  pageCount: Joi.number().required(),
  readPage: Joi.number().default(1),
  reading: Joi.boolean().default(false),
});

const getAll = () => JSONDB.read('books');

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
