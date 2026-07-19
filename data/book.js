import mongoose from 'mongoose';
import bookSchema from '../src/models/bookSchema.js';

const Book = mongoose.models.Book || mongoose.model('Book', bookSchema);

export default Book;
