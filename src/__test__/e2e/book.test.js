const Server = require('../../server');

const BookShelf = new Server();

const insertedBooks = [];

const expectedHeader = {
  'content-type': 'application/json; charset=utf-8',
};

const deleteAllSavedBooks = () => {
  insertedBooks.forEach(async (book) => {
    const options = {
      method: 'DELETE',
      url: `/books/${book.id}`,
    };
    await BookShelf.server.inject(options);
  });
};

const insertbooks = () => {
  const booksData = [
    {
      name: 'Buku B',
      year: 2012,
      author: 'Jundu',
      summary: 'Lorem lurd dulur dan kawan kawan',
      publisher: 'Tsu Corp',
      pageCount: 120,
      readPage: 120,
      reading: false,
    },
    {
      name: 'Buku C',
      year: 2017,
      author: 'Junduh',
      summary: 'Lorem kawan kawan',
      publisher: 'Oud Corp',
      pageCount: 200,
      readPage: 120,
      reading: true,
    },
  ];
  booksData.forEach(async (book) => {
    const options = {
      method: 'POST',
      url: '/books',
      payload: book,
    };
    const data = await BookShelf.server.inject(options);
    data.payload = JSON.parse(data.payload);
    insertedBooks.push({
      ...book,
      id: data.payload.data.bookId,
      finished: book.pageCount === book.readPage,
    });
  });
};

// Start application before running the test case
beforeAll(async (done) => {
  BookShelf.server.events.on('start', () => {
    done();
  });
  BookShelf.start();
  await insertbooks();
});

// Stop application after running the test case
afterAll(async (done) => {
  BookShelf.server.events.on('stop', () => {
    done();
  });
  await deleteAllSavedBooks();
  BookShelf.stop();
});

describe('Test /books endpoints', () => {
  describe('GET /books', () => {
    const formatAllBooks = (books) => books.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));

    it('should return all books', async () => {
      const formatedBooks = formatAllBooks(insertedBooks);
      const expectedPayload = {
        status: 'success',
        data: { books: formatedBooks },
      };
      const options = {
        method: 'GET',
        url: '/books',
      };
      const data = await BookShelf.server.inject(options);
      data.payload = JSON.parse(data.payload);
      expect(data.statusCode).toBe(200);
      expect(data.payload).toMatchObject(expectedPayload);
    });

    it('should return all finished books', async () => {
      const finishedBook = insertedBooks.filter((book) => book.finished);
      const formatedBooks = formatAllBooks(finishedBook);
      const expectedPayload = {
        status: 'success',
        data: { books: formatedBooks },
      };
      const options = {
        method: 'GET',
        url: '/books?finished=1',
      };
      const data = await BookShelf.server.inject(options);
      data.payload = JSON.parse(data.payload);
      expect(data.statusCode).toBe(200);
      expect(data.payload).toMatchObject(expectedPayload);
    });
  });

  describe('POST /books', () => {
    const newBookData = {
      name: 'Buku Baru',
      year: 2010,
      author: 'John Doe',
      summary: 'Lorem ipsum dolor sit amet',
      publisher: 'Indonesia Publisher',
      pageCount: 100,
      readPage: 25,
      reading: true,
    };
    it('should return fail response when data invalid', async () => {
      const invalidPayload = { ...newBookData };
      delete invalidPayload.name;
      const options = {
        method: 'POST',
        url: '/books',
        payload: invalidPayload,
      };
      const expectedPayload = {
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      };

      const data = await BookShelf.server.inject(options);
      data.payload = JSON.parse(data.payload);
      expect(data.statusCode).toBe(400);
      expect(data.headers).toMatchObject(expectedHeader);
      expect(data.payload).toMatchObject(expectedPayload);
    });

    it('should return success response', async () => {
      const options = {
        method: 'POST',
        url: '/books',
        payload: newBookData,
      };
      const expectedPayload = {
        message: 'Buku berhasil ditambahkan',
        status: 'success',
      };

      const data = await BookShelf.server.inject(options);
      data.payload = JSON.parse(data.payload);
      expect(data.statusCode).toBe(201);
      expect(data.headers).toMatchObject(expectedHeader);
      expect(data.payload).toMatchObject(expectedPayload);

      newBookData.id = data.payload.data.bookId;
      newBookData.finished = newBookData.pageCount === newBookData.readPage;
      insertedBooks.push(newBookData);
    });
  });

  describe('GET /books/{bookId}', () => {
    it('should return not found respond', async () => {
      const expectedPayload = {
        status: 'fail',
        message: 'Buku tidak ditemukan',
      };
      const options = {
        method: 'GET',
        url: '/books/invalidId',
      };
      const data = await BookShelf.server.inject(options);
      data.payload = JSON.parse(data.payload);
      expect(data.statusCode).toBe(404);
      expect(data.payload).toMatchObject(expectedPayload);
    });

    it('should return success respond', async () => {
      const book = insertedBooks[0];
      const expectedPayload = {
        status: 'success',
        data: { book },
      };
      const options = {
        method: 'GET',
        url: `/books/${book.id}`,
      };
      const data = await BookShelf.server.inject(options);
      data.payload = JSON.parse(data.payload);
      expect(data.statusCode).toBe(200);
      expect(data.payload).toMatchObject(expectedPayload);
    });
  });

  describe('PUT /books', () => {
    it('should return not found respond', async () => {
      const requestPayload = {
        ...insertedBooks[0],
        name: 'Buku terupdate',
        year: 2019,
        author: 'John Doeh',
        summary: 'summary',
        publisher: 'International Publisher',
        pageCount: 100,
        readPage: 100,
        reading: false,
      };
      delete requestPayload.id;
      delete requestPayload.finished;
      const expectedPayload = {
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      };
      const options = {
        method: 'PUT',
        url: '/books/invalidId',
        payload: requestPayload,
      };

      const response = await BookShelf.server.inject(options);
      response.payload = JSON.parse(response.payload);
      expect(response.statusCode).toBe(404);
      expect(response.payload).toMatchObject(expectedPayload);
    });

    it('should return fail response when data invalid', async () => {
      const requestPayload = {
        ...insertedBooks[0],
        name: 'Buku terupdate',
        year: 2019,
        author: 'John Doeh',
        summary: 'summary',
        publisher: 'International Publisher',
        pageCount: 100,
        readPage: 100,
        reading: false,
      };
      const bookId = requestPayload.id;
      delete requestPayload.id;
      delete requestPayload.name;
      delete requestPayload.finished;
      const expectedPayload = {
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      };
      const options = {
        method: 'PUT',
        url: `/books/${bookId}`,
        payload: requestPayload,
      };

      const response = await BookShelf.server.inject(options);
      response.payload = JSON.parse(response.payload);
      expect(response.statusCode).toBe(400);
      expect(response.headers).toMatchObject(expectedHeader);
      expect(response.payload).toMatchObject(expectedPayload);
    });

    it('should return success response', async () => {
      const requestPayload = {
        ...insertedBooks[0],
        name: 'Buku terupdate',
        year: 2019,
        author: 'John Doeh',
        summary: 'summary',
        publisher: 'International Publisher',
        pageCount: 100,
        readPage: 100,
        reading: false,
      };
      const bookId = requestPayload.id;
      delete requestPayload.id;
      delete requestPayload.finished;
      delete requestPayload.updateAt;
      const expectedPayload = {
        status: 'success',
        message: 'Buku berhasil diperbarui',
        data: { book: requestPayload },
      };
      const options = {
        method: 'PUT',
        url: `/books/${bookId}`,
        payload: requestPayload,
      };

      const response = await BookShelf.server.inject(options);
      response.payload = JSON.parse(response.payload);
      expect(response.statusCode).toBe(200);
      expect(response.headers).toMatchObject(expectedHeader);
      expect(response.payload).toMatchObject(expectedPayload);
    });
  });

  describe('DELETE /books/{bookId}', () => {
    it('should return not found respond', async () => {
      const expectedPayload = {
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
      };
      const options = {
        method: 'DELETE',
        url: '/books/invalidId',
      };
      const data = await BookShelf.server.inject(options);
      data.payload = JSON.parse(data.payload);
      expect(data.statusCode).toBe(404);
      expect(data.payload).toMatchObject(expectedPayload);
    });

    it('should return success respond', async () => {
      const book = insertedBooks[0];
      const expectedPayload = {
        status: 'success',
        message: 'Buku berhasil dihapus',
      };
      const options = {
        method: 'DELETE',
        url: `/books/${book.id}`,
      };
      const data = await BookShelf.server.inject(options);
      data.payload = JSON.parse(data.payload);
      expect(data.statusCode).toBe(200);
      expect(data.payload).toMatchObject(expectedPayload);
    });
  });
});
