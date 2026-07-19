import Book from '../../data/book.js';
import {
  VALID_STATUSES,
  allowedStatuses,
  hasField,
  isValidRating,
  normalizeText
} from '../validators/bookValidator.js';

function handleServerError(res, error) {
  console.error(error);
  return res.status(500).json({ error: 'Server error.' });
}

export async function getBooks(req, res) {
  const { status } = req.query;

  if (status && !VALID_STATUSES.has(status)) {
    return res.status(400).json({
      error: 'Invalid status filter.',
      allowedStatuses: allowedStatuses()
    });
  }

  try {
    const books = await Book.find(status ? { status } : {}).sort({ createdAt: -1 });
    return res.json(books);
  } catch (error) {
    return handleServerError(res, error);
  }
}

export async function createBook(req, res) {
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

  try {
    const book = await Book.create({
      title,
      author,
      genre,
      status,
      rating
    });

    return res.status(201).json(book);
  } catch (error) {
    return handleServerError(res, error);
  }
}

export async function updateBook(req, res) {
  const body = req.body || {};
  const updates = {};

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

  try {
    const book = await Book.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    if (!book) {
      return res.status(404).json({ error: 'Book not found.' });
    }

    return res.json(book);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'Book not found.' });
    }

    return handleServerError(res, error);
  }
}

export async function deleteBook(req, res) {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);

    if (!deletedBook) {
      return res.status(404).json({ error: 'Book not found.' });
    }

    return res.json({
      message: 'Book deleted successfully.',
      book: deletedBook
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'Book not found.' });
    }

    return handleServerError(res, error);
  }
}
