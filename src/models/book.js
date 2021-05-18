const books = [
  {
    id: 'Qbax5Oy7L8WKf74l',
    name: 'Buku A',
    year: 2010,
    author: 'John Doe',
    summary: 'Lorem ipsum dolor sit amet',
    publisher: 'Dicoding Indonesia',
    pageCount: 100,
    readPage: 25,
    finished: false,
    reading: false,
    insertedAt: '2021-03-04T09:11:44.598Z',
    updatedAt: '2021-03-04T09:11:44.598Z',
  },
];

function all() {
  return [...books];
}

module.exports = {
  all,
};
