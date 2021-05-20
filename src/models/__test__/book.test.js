const NanoID = require('nanoid');

const Book = require('../book');
const JSONDB = require('../../database/json');

const randomTime = new Date().toISOString();
const randomID = NanoID.nanoid();
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

jest.mock('nanoid');
jest.mock('../../database/json');

beforeEach(() => {
  NanoID.nanoid.mockReturnValue(randomID);
  JSONDB.get.mockReturnThis();
  JSONDB.push.mockReturnThis();
  jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(randomTime);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Test getAll', () => {
  it('should return all books', () => {
    const formatedBook = dummyData.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));
    JSONDB.value.mockReturnValue(dummyData);

    const result = Book.getAll();
    expect(JSONDB.get).toHaveBeenCalledWith('books');
    expect(JSONDB.value).toHaveBeenCalled();
    expect(result).toEqual(formatedBook);
  });
  it('should return all finished book', () => {
    const finishedBook = dummyData.filter((book) => book.finished);
    const formatedBook = finishedBook.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));
    JSONDB.value.mockReturnValue(dummyData);

    const result = Book.getAll({ finished: true });
    expect(JSONDB.get).toHaveBeenCalledWith('books');
    expect(JSONDB.value).toHaveBeenCalled();
    expect(result).toEqual(formatedBook);
  });
  it('should return all reading book', () => {
    const readingBook = dummyData.filter((book) => book.reading);
    const formatedBook = readingBook.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));
    JSONDB.value.mockReturnValue(dummyData);

    const result = Book.getAll({ reading: true });
    expect(JSONDB.get).toHaveBeenCalledWith('books');
    expect(JSONDB.value).toHaveBeenCalled();
    expect(result).toEqual(formatedBook);
  });
  it('should return all book with matched name', () => {
    const searchNameQuery = 'Buku A';
    const matchedBook = dummyData.filter((book) => book.name === searchNameQuery);
    const formatedBook = matchedBook.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));
    JSONDB.value.mockReturnValue(dummyData);

    const result = Book.getAll({ name: searchNameQuery });
    expect(JSONDB.get).toHaveBeenCalledWith('books');
    expect(JSONDB.value).toHaveBeenCalled();
    expect(result).toEqual(formatedBook);
  });
});

describe('Test create', () => {
  const data = {
    name: 'Buku NM',
    year: 2020,
    author: 'John Does',
    summary: 'Lorem ipsum ddolor sit amet',
    publisher: 'Dicoding Indonesia',
    pageCount: 100,
    readPage: 100,
    finished: false,
    reading: false,
  };
  const generated = {
    id: randomID,
    finished: data.readPage === data.pageCount,
    insertedAt: randomTime,
    updatedAt: randomTime,
  };

  it('should return the new entry', () => {
    const newData = { ...data, ...generated };
    JSONDB.value.mockReturnValue(newData);

    const book = Book.create(data);
    expect(book).toEqual(newData);
    expect(JSONDB.get).toBeCalled();
    expect(JSONDB.push).toBeCalled();
    expect(JSONDB.write).toBeCalled();
    expect(JSONDB.value).toBeCalled();
  });
});

// not necessary because only calling method, does not have any logic
describe('Test update', () => {
  it('should return deleted entries', () => {
    const willUpdate = { ...dummyData[0] };
    const updateData = {
      name: 'Buku NM',
      year: 2020,
      author: 'John Does',
    };
    const updatedData = { ...willUpdate, ...updateData };
    JSONDB.find.mockReturnThis();
    JSONDB.assign.mockReturnThis();
    JSONDB.write.mockReturnValue(updatedData);

    const updatedBook = Book.updateById(willUpdate.id, updateData);
    expect(JSONDB.get).toBeCalledWith('books');
    expect(JSONDB.find).toBeCalledWith({ id: willUpdate.id });
    expect(JSONDB.write).toBeCalled();
    expect(updatedBook).toEqual(updatedData);
  });
});

// not necessary because only calling method, does not have any logic
describe('Test delete', () => {
  it('should return deleted entries', () => {
    const willDeleted = { ...dummyData[0] };
    JSONDB.remove.mockReturnThis();
    JSONDB.write.mockReturnValue(willDeleted);

    const deletedBook = Book.deleteById(willDeleted.id);
    expect(JSONDB.get).toBeCalledWith('books');
    expect(JSONDB.remove).toBeCalledWith({ id: willDeleted.id });
    expect(JSONDB.write).toBeCalled();
    expect(deletedBook).toEqual(deletedBook);
  });
});
