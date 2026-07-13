import express from 'express';
import {
  createBook,
  deleteBook,
  getBooks,
  updateBook
} from '../controllers/bookController.js';

const router = express.Router();

router.get('/', getBooks);
router.post('/', createBook);
router.patch('/:id', updateBook);
router.delete('/:id', deleteBook);

export default router;
