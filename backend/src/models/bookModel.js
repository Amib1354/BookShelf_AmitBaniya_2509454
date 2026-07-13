import initialBooks from '../data/books.js';

let books = initialBooks.map((book) => ({ ...book }));
let nextBookId = Math.max(...books.map((book) => book.id), 0) + 1;

function findAll() {
  return books;
}

function findByStatus(status) {
  return books.filter((book) => book.status === status);
}

function findById(id) {
  return books.find((book) => book.id === Number(id));
}

function create(bookData) {
  const book = {
    id: nextBookId,
    ...bookData
  };

  nextBookId += 1;
  books.push(book);

  return book;
}

function update(id, updates) {
  const bookIndex = books.findIndex((book) => book.id === Number(id));

  if (bookIndex === -1) {
    return null;
  }

  books[bookIndex] = {
    ...books[bookIndex],
    ...updates
  };

  return books[bookIndex];
}

function remove(id) {
  const bookIndex = books.findIndex((book) => book.id === Number(id));

  if (bookIndex === -1) {
    return null;
  }

  const [deletedBook] = books.splice(bookIndex, 1);
  return deletedBook;
}

export default {
  findAll,
  findByStatus,
  findById,
  create,
  update,
  remove
};
