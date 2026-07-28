import dbConnection from '../src/config/db.js';
import Book from './book.js';

const BOOKS = [
  { title: 'Atomic Habits', author: 'James Clear', genre: 'Self-help', status: 'want', rating: 0 },
  { title: 'Project Hail Mary', author: 'Andy Weir', genre: 'Science Fiction', status: 'want', rating: 0 },
  {
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    genre: 'Technology',
    status: 'reading',
    rating: 0
  },
  {
    title: "You Don't Know JS Yet",
    author: 'Kyle Simpson',
    genre: 'Programming',
    status: 'reading',
    rating: 0
  },
  { title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fantasy', status: 'finished', rating: 5 },
  { title: 'Steve Jobs', author: 'Walter Isaacson', genre: 'Biography', status: 'finished', rating: 4 }
];

await dbConnection();
await Book.deleteMany({});
await Book.insertMany(BOOKS);

console.log('Books seeded successfully!');
process.exit(0);

export default BOOKS;
