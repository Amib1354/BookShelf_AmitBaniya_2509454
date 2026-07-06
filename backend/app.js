const express = require('express');

const app = express();
const PORT = process.env.PORT || 3001;
const VALID_STATUSES = new Set(['want', 'reading', 'finished']);

let nextBookId = 7;
let books = [
  { id: 1, title: 'Atomic Habits', author: 'James Clear', genre: 'Self-help', status: 'want', rating: 0 },
  { id: 2, title: 'Project Hail Mary', author: 'Andy Weir', genre: 'Science Fiction', status: 'want', rating: 0 },
  {
    id: 3,
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    genre: 'Technology',
    status: 'reading',
    rating: 0
  },
  { id: 4, title: "You Don't Know JS Yet", author: 'Kyle Simpson', genre: 'Programming', status: 'reading', rating: 0 },
  { id: 5, title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fantasy', status: 'finished', rating: 5 },
  { id: 6, title: 'Steve Jobs', author: 'Walter Isaacson', genre: 'Biography', status: 'finished', rating: 4 }
];

app.use(express.json());

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON body.' });
  }

  return next(err);
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  return next();
});

function findBookIndex(id) {
  return books.findIndex((book) => book.id === Number(id));
}

function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function isValidRating(value) {
  return Number.isInteger(value) && value >= 0 && value <= 5;
}

function hasField(body, field) {
  return Object.prototype.hasOwnProperty.call(body, field);
}

app.get('/', (req, res) => {
  res.json({
    message: 'BookShelf REST API',
    endpoints: ['GET /api/books', 'GET /api/books?status=finished', 'POST /api/books', 'PATCH /api/books/:id', 'DELETE /api/books/:id']
  });
});

app.get('/api/books', (req, res) => {
  const { status } = req.query;

  if (status && !VALID_STATUSES.has(status)) {
    return res.status(400).json({
      error: 'Invalid status filter.',
      allowedStatuses: [...VALID_STATUSES]
    });
  }

  const result = status ? books.filter((book) => book.status === status) : books;
  return res.json(result);
});

app.post('/api/books', (req, res) => {
  const body = req.body || {};
  const title = normalizeText(body.title);
  const author = normalizeText(body.author);
  const genre = normalizeText(body.genre);
  const status = body.status || 'want';
  const rating = body.rating ?? 0;

  if (!title) {
    return res.status(400).json({ error: 'Title is required.' });
  }

  if (!VALID_STATUSES.has(status)) {
    return res.status(400).json({
      error: 'Invalid status.',
      allowedStatuses: [...VALID_STATUSES]
    });
  }

  if (!isValidRating(rating)) {
    return res.status(400).json({ error: 'Rating must be an integer from 0 to 5.' });
  }

  const book = {
    id: nextBookId,
    title,
    author,
    genre,
    status,
    rating
  };

  nextBookId += 1;
  books.push(book);

  return res.status(201).json(book);
});

app.patch('/api/books/:id', (req, res) => {
  const bookIndex = findBookIndex(req.params.id);
  const body = req.body || {};

  if (bookIndex === -1) {
    return res.status(404).json({ error: 'Book not found.' });
  }

  const updates = {};

  if (hasField(body, 'status')) {
    if (!VALID_STATUSES.has(body.status)) {
      return res.status(400).json({
        error: 'Invalid status.',
        allowedStatuses: [...VALID_STATUSES]
      });
    }

    updates.status = body.status;
  }

  if (hasField(body, 'rating')) {
    if (!isValidRating(body.rating)) {
      return res.status(400).json({ error: 'Rating must be an integer from 0 to 5.' });
    }

    updates.rating = body.rating;
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'Send status and/or rating to update a book.' });
  }

  books[bookIndex] = {
    ...books[bookIndex],
    ...updates
  };

  return res.json(books[bookIndex]);
});

app.delete('/api/books/:id', (req, res) => {
  const bookIndex = findBookIndex(req.params.id);

  if (bookIndex === -1) {
    return res.status(404).json({ error: 'Book not found.' });
  }

  const [deletedBook] = books.splice(bookIndex, 1);

  return res.json({
    message: 'Book deleted successfully.',
    book: deletedBook
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}...`);
  });
}

module.exports = app;
