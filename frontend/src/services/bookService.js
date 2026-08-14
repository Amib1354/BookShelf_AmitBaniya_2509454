import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  || (import.meta.env.PROD ? '/.netlify/functions/api/api' : 'http://localhost:3001/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * GET /books – retrieve all books
 */
export function getBooks() {
  return api.get('/books');
}

/**
 * Load books and update React state.
 * Mirrors the useEffect pattern the user provided.
 * @param {Function} setBooks   - React state setter for books array
 * @param {Function} setIsLoading - React state setter for loading flag
 * @param {Function} setErrors   - React state setter for errors array
 */
export async function loadBooks(setBooks, setIsLoading, setErrors) {
  try {
    const response = await getBooks();
    setBooks(response.data);
  } catch (error) {
    setErrors((prev) => [...prev, error]);
  } finally {
    setIsLoading(false);
  }
}

/**
 * Change a book's status (e.g., move to reading or finished).
 * @param {string} bookId - MongoDB _id of the book
 * @param {string} newStatus - Target status ('reading' | 'finished' | 'want')
 */
export function moveBook(bookId, newStatus) {
  return updateBook(bookId, { status: newStatus });
}

/**
 * POST /books – add a new book
 * @param {Object} book – book data (title, author, etc.)
 */
export function addBook(book) {
  return api.post('/books', book);
}

/**
 * PUT /books/:id – update an existing book
 * @param {string} bookId – MongoDB _id of the book
 * @param {Object} book – updated fields
 */
export function updateBook(bookId, book) {
  return api.patch(`/books/${bookId}`, book);
}

/**
 * DELETE /books/:id – delete a book
 * @param {string} bookId – MongoDB _id of the book
 */
export function deleteBook(bookId) {
  return api.delete(`/books/${bookId}`);
}
