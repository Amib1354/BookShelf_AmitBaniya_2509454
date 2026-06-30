import React from 'react';
import BookColumn from './components/BookColumn';
import booksIcon from './assets/books icon.png';
import bookshelfIcon from './assets/bookshelf.png';
import readingBookIcon from './assets/reading-book.png';
import wantToReadIcon from './assets/want to read.png';

const SAMPLE_BOOKS = [
  { id: 1, title: "Atomic Habits", author: "James Clear", status: "Want to Read" },
  { id: 2, title: "Project Hail Mary", author: "Andy Weir", status: "Want to Read" },
  { id: 3, title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", status: "Reading" },
  { id: 4, title: "You Don't Know JS Yet", author: "Kyle Simpson", status: "Reading" },
  { id: 5, title: "The Hobbit", author: "J.R.R. Tolkien", status: "Finished", rating: 5 },
  { id: 6, title: "Steve Jobs", author: "Walter Isaacson", status: "Finished", rating: 4 },
];

export default function App() {
  const wantToReadBooks = SAMPLE_BOOKS.filter(book => book.status === 'Want to Read');
  const readingBooks = SAMPLE_BOOKS.filter(book => book.status === 'Reading');
  const finishedBooks = SAMPLE_BOOKS.filter(book => book.status === 'Finished');

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src={booksIcon} alt="" className="h-8 w-8 object-contain" />
            <h1 className="text-xl font-bold tracking-tight text-slate-800">
              BookShelf <span className="text-blue-600 font-medium text-sm">v1.0</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-blue-100">
            <img src={readingBookIcon} alt="" className="h-5 w-5 object-contain" />
            <span>AI Recommender Engine Connected</span>
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">My Reading Workspace</h2>
          <p className="text-slate-500 text-sm mt-1">Track your progress and organize your library.</p>
        </div>

        {/* 3-Column Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BookColumn title="Want to Read" iconSrc={wantToReadIcon} books={wantToReadBooks} />
          <BookColumn title="Reading" iconSrc={readingBookIcon} books={readingBooks} />
          <BookColumn title="Finished" iconSrc={bookshelfIcon} books={finishedBooks} />
        </div>
      </main>
    </div>
  );
}
