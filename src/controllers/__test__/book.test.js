/* eslint-disable func-names */
const BookController = require('../book');
const Book = require('../../models/book');

jest.mock('../../models/book');

function Request() {
  this.params = {};
  this.query = {};
  this.payload = {};
}

function Response() {
  this.statusCode = 200;
  this.payload = null;
}

Response.prototype.response = function (payload) {
  this.payload = payload;
  return this;
};
Response.prototype.code = function (statusCode) {
  this.statusCode = statusCode;
  return this;
};

const dummyData = [
  {
    id: 'Qbax5Oy7L8WKf74l',
    name: 'Buku A',
    year: 2010,
    author: 'John Doe',
    summary: 'Lorem ipsum dolor sit amet',
    publisher: 'Indonesia Publisher',
    pageCount: 100,
    readPage: 25,
    finished: false,
    reading: true,
    insertedAt: '2021-03-04T09:11:44.598Z',
    updatedAt: '2021-03-04T09:11:44.598Z',
  },
  {
    id: 'T5sd1Oyas8WKf74l',
    name: 'Buku B',
    year: 2012,
    author: 'Jundu',
    summary: 'Lorem lurd dulur dan kawan kawan',
    publisher: 'Tsu Corp',
    pageCount: 120,
    readPage: 120,
    finished: true,
    reading: false,
    insertedAt: '2021-02-04T09:12:44.598Z',
    updatedAt: '2021-03-04T09:14:44.598Z',
  },
];

describe('Test getAllBooks', () => {
  const formatAllBooks = (books) => books.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  it('should return success response with all books', () => {
    const h = new Response();
    const request = new Request();
    const formatedBook = formatAllBooks(dummyData);
    const expectedResponse = {
      status: 'success',
      data: { books: formatedBook },
    };
    Book.getAll.mockReturnValue(formatedBook);

    const result = BookController.getAllBooks.handler(request, h);
    expect(Book.getAll).toHaveBeenCalled();
    expect(result.statusCode).toEqual(200);
    expect(result.payload).toEqual(expectedResponse);
  });

  it('should return success response with finished books', () => {
    const h = new Response();
    const request = new Request();
    request.query = { finished: true };
    const finishedBook = dummyData.filter((book) => book.finished);
    const formatedBook = formatAllBooks(finishedBook);
    const expectedResponse = {
      status: 'success',
      data: { books: formatedBook },
    };
    Book.getAll.mockReturnValue(formatedBook);

    const result = BookController.getAllBooks.handler(request, h);
    expect(Book.getAll).toHaveBeenCalledWith(request.payload);
    expect(result.statusCode).toEqual(200);
    expect(result.payload).toEqual(expectedResponse);
  });

  it('should return success response with reading books', () => {
    const h = new Response();
    const request = new Request();
    request.query = { reading: true };
    const readingBook = dummyData.filter((book) => book.reading);
    const formatedBook = formatAllBooks(readingBook);
    const expectedResponse = {
      status: 'success',
      data: { books: formatedBook },
    };
    Book.getAll.mockReturnValue(formatedBook);

    const result = BookController.getAllBooks.handler(request, h);
    expect(Book.getAll).toHaveBeenCalledWith(request.payload);
    expect(result.statusCode).toEqual(200);
    expect(result.payload).toEqual(expectedResponse);
  });

  it('should return success response with matched book name', () => {
    const h = new Response();
    const request = new Request();
    request.query = { name: 'Buku A' };
    const filteredBook = dummyData.filter((book) => book.name === request.query.name);
    const formatedBook = formatAllBooks(filteredBook);
    const expectedResponse = {
      status: 'success',
      data: { books: formatedBook },
    };
    Book.getAll.mockReturnValue(formatedBook);

    const result = BookController.getAllBooks.handler(request, h);
    expect(Book.getAll).toHaveBeenCalledWith(request.payload);
    expect(result.statusCode).toEqual(200);
    expect(result.payload).toEqual(expectedResponse);
  });
});

describe('Test findBook', () => {
  it('should return error response when the book is not found', () => {
    const randomId = 'random-book-id';
    const h = new Response();
    const request = new Request();
    request.params = { bookId: randomId };
    const expectedResponse = {
      status: 'fail',
      message: 'Buku tidak ditemukan',
    };
    Book.find.mockReturnValue(null);

    const result = BookController.findBook.handler(request, h);
    expect(Book.find).toHaveBeenCalledWith(randomId);
    expect(result.statusCode).toEqual(404);
    expect(result.payload).toEqual(expectedResponse);
  });

  it('should return success response when the book is found', () => {
    const h = new Response();
    const request = new Request();
    request.params = { bookId: dummyData[0].id };
    const expectedResponse = {
      status: 'success',
      data: { book: dummyData[0] },
    };
    Book.find.mockReturnValue(dummyData[0]);

    const result = BookController.findBook.handler(request, h);
    expect(Book.find).toHaveBeenCalledWith(dummyData[0].id);
    expect(result.statusCode).toEqual(200);
    expect(result.payload).toEqual(expectedResponse);
  });
});

describe('Test createBook', () => {
  const data = {
    name: 'Buku NM',
    year: 2020,
    author: 'John Does',
    summary: 'Lorem ipsum ddolor sit amet',
    publisher: 'Dicoding Indonesia',
    pageCount: 100,
    readPage: 100,
    reading: false,
  };
  const processedData = {
    id: 'this-is-super-random-id',
    finished: data.pageCount === data.readPage,
    insertedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const createdBook = { ...data, ...processedData };
  it('should return success response when the book is created', () => {
    const h = new Response();
    const request = new Request();
    request.payload = data;
    const expectedResponse = {
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: { bookId: processedData.id },
    };
    Book.create.mockReturnValue(createdBook);

    const result = BookController.createBook.handler(request, h);
    expect(Book.create).toHaveBeenCalledWith(data);
    expect(result.statusCode).toEqual(201);
    expect(result.payload).toEqual(expectedResponse);
  });
});

describe('Test updateBook', () => {
  const data = {
    id: 'this-is-super-random-id',
    name: 'Buku NM',
    year: 2020,
    author: 'John Does',
    summary: 'Lorem ipsum ddolor sit amet',
    publisher: 'Dicoding Indonesia',
    pageCount: 100,
    readPage: 100,
    reading: false,
    insertedAt: new Date().toISOString(),
  };
  const processedData = {
    finished: data.pageCount === data.readPage,
    updatedAt: new Date().toISOString(),
  };
  const updatedBook = { ...data, ...processedData };

  it('should return error response when the book is not found', () => {
    const randomId = 'invalid-id';
    const h = new Response();
    const request = new Request();
    request.params = { bookId: randomId };
    request.payload = data;
    const expectedResponse = {
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    };
    Book.find.mockReturnValue(null);

    const result = BookController.updateBook.handler(request, h);
    expect(Book.find).toHaveBeenCalledWith(randomId);
    expect(result.statusCode).toEqual(404);
    expect(result.payload).toEqual(expectedResponse);
  });

  it('should return success response when the book is updated', () => {
    const h = new Response();
    const request = new Request();
    request.params = { bookId: data.id };
    const expectedResponse = {
      status: 'success',
      message: 'Buku berhasil diperbarui',
      data: { book: updatedBook },
    };
    Book.find.mockReturnValue(data);
    Book.updateById.mockReturnValue(updatedBook);

    const result = BookController.updateBook.handler(request, h);
    expect(Book.find).toHaveBeenCalledWith(data.id);
    expect(result.statusCode).toEqual(200);
    expect(result.payload).toEqual(expectedResponse);
  });
});

describe('Test deleteBook', () => {
  it('should return error response when the book is not found', () => {
    const randomID = 'random-book-id';
    const h = new Response();
    const request = new Request();
    request.params = { bookId: randomID };
    const expectedResponse = {
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    };
    Book.find.mockReturnValue(null);
    const result = BookController.deleteBook.handler(request, h);
    expect(Book.find).toHaveBeenCalledWith(randomID);
    expect(result.statusCode).toEqual(404);
    expect(result.payload).toEqual(expectedResponse);
  });

  it('should return success response when the book is deleted', () => {
    const h = new Response();
    const request = new Request();
    request.params = { bookId: dummyData[0].id };
    const expectedResponse = {
      status: 'success',
      message: 'Buku berhasil dihapus',
    };
    Book.find.mockReturnValue(dummyData[0]);
    Book.deleteById.mockReturnValue(dummyData[0]);

    const result = BookController.deleteBook.handler(request, h);
    expect(Book.find).toHaveBeenCalledWith(dummyData[0].id);
    expect(result.statusCode).toEqual(200);
    expect(result.payload).toEqual(expectedResponse);
  });
});
