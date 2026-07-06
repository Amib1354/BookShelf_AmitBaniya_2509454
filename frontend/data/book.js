export const sampleBooks = [
  { id: 1, title: 'Atomic Habits', author: 'James Clear', genre: 'Self-help', status: 'want' },
  { id: 2, title: 'Project Hail Mary', author: 'Andy Weir', genre: 'Science Fiction', status: 'want' },
  {
    id: 3,
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    genre: 'Technology',
    status: 'reading'
  },
  { id: 4, title: "You Don't Know JS Yet", author: 'Kyle Simpson', genre: 'Programming', status: 'reading' },
  { id: 5, title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fantasy', status: 'finished', rating: 5 },
  { id: 6, title: 'Steve Jobs', author: 'Walter Isaacson', genre: 'Biography', status: 'finished', rating: 4 }
];

export const shelves = [
  { status: 'want', title: 'Want to Read', icon: 'wantToRead' },
  { status: 'reading', title: 'Reading', icon: 'readingBook' },
  { status: 'finished', title: 'Finished', icon: 'bookshelf' }
];
