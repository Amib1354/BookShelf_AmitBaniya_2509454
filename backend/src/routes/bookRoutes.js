import express from 'express';
import {
  createBook,
  deleteBook,
  getBooks,
  updateBook
} from '../controllers/bookController.js';
import authenticate from '../middleware/authenticate.js';

const router = express.Router();

router.get('/', authenticate, getBooks);
router.post('/', authenticate, createBook);
router.patch('/:id', authenticate, updateBook);
router.delete('/:id', authenticate, deleteBook);

export default router;

