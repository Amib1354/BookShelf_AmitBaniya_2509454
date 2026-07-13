import Book from '../models/bookModel.js';
import {
  VALID_STATUSES,
  allowedStatuses,
  hasField,
  isValidRating,
  normalizeText
} from '../validators/bookValidator.js';

export function getBooks(req, res) {
  const { status } = req.query;

  if (status && !VALID_STATUSES.has(status)) {
    return res.status(400).json({
      error: 'Invalid status filter.',
      allowedStatuses: allowedStatuses()
    });
  }

  const books = status ? Book.findByStatus(status) : Book.findAll();
  return res.json(books);
}

export function createBook(req, res) {
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
      allowedStatuses: allowedStatuses()
    });
  }

  if (!isValidRating(rating)) {
    return res.status(400).json({ error: 'Rating must be an integer from 0 to 5.' });
  }

  const book = Book.create({
    title,
    author,
    genre,
    status,
    rating
  });

  return res.status(201).json(book);
}

export function updateBook(req, res) {
  const body = req.body || {};
  const updates = {};

  if (!Book.findById(req.params.id)) {
    return res.status(404).json({ error: 'Book not found.' });
  }

  if (hasField(body, 'status')) {
    if (!VALID_STATUSES.has(body.status)) {
      return res.status(400).json({
        error: 'Invalid status.',
        allowedStatuses: allowedStatuses()
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

  const book = Book.update(req.params.id, updates);
  return res.json(book);
}

export function deleteBook(req, res) {
  const deletedBook = Book.remove(req.params.id);

  if (!deletedBook) {
    return res.status(404).json({ error: 'Book not found.' });
  }

  return res.json({
    message: 'Book deleted successfully.',
    book: deletedBook
  });
}
