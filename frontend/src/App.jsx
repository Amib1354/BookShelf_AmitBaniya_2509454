import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { sampleBooks, shelves } from '../data/book';
import AddBookModal from './components/AddBookModal';
import BookColumn from './components/BookColumn';
import booksIcon from './assets/books icon.png';
import bookshelfIcon from './assets/bookshelf.png';
import readingBookIcon from './assets/reading-book.png';
import wantToReadIcon from './assets/want to read.png';

const shelfIcons = {
  wantToRead: wantToReadIcon,
  readingBook: readingBookIcon,
  bookshelf: bookshelfIcon
};

const SHELVES = shelves.map((shelf) => ({
  ...shelf,
  iconSrc: shelfIcons[shelf.icon] || readingBookIcon
}));

function ReadingTracker() {
  const navigate = useNavigate();
  const [books, setBooks] = useState(() => [...sampleBooks]);
  const [shelfCounts, setShelfCounts] = useState({
    want: 0,
    reading: 0,
    finished: 0
  });

  useEffect(() => {
    setShelfCounts(
      books.reduce(
        (counts, book) => ({
          ...counts,
          [book.status]: (counts[book.status] || 0) + 1
        }),
        { want: 0, reading: 0, finished: 0 }
      )
    );
  }, [books]);

  const booksByShelf = useMemo(() => {
    return SHELVES.reduce((groupedBooks, shelf) => {
      groupedBooks[shelf.status] = books.filter((book) => book.status === shelf.status);
      return groupedBooks;
    }, {});
  }, [books]);

  const handleAddBook = (book) => {
    setBooks((currentBooks) => [
      {
        id: Date.now(),
        ...book,
        status: 'want',
        rating: 0
      },
      ...currentBooks
    ]);
  };

  const handleMoveBook = (bookId, nextStatus) => {
    setBooks((currentBooks) =>
      currentBooks.map((book) =>
        book.id === bookId
          ? {
              ...book,
              status: nextStatus,
              rating: nextStatus === 'finished' ? book.rating || 0 : 0
            }
          : book
      )
    );
  };

  const handleDeleteBook = (bookId) => {
    setBooks((currentBooks) => currentBooks.filter((book) => book.id !== bookId));
  };

  const handleRateBook = (bookId, rating) => {
    setBooks((currentBooks) =>
      currentBooks.map((book) => (book.id === bookId ? { ...book, rating } : book))
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <img src={booksIcon} alt="" className="h-8 w-8 object-contain" />
            <h1 className="text-xl font-bold tracking-tight text-slate-800">
              BookShelf <span className="text-blue-600 font-medium text-sm">v1.0</span>
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-blue-100">
            <img src={readingBookIcon} alt="" className="h-5 w-5 object-contain" />
            <span>{books.length} books tracked this session</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">My Reading Workspace</h2>
            <p className="text-slate-500 text-sm mt-1">Books can be added, moved between shelves, rated, and deleted.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/add')}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            Add Book
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SHELVES.map((shelf) => (
            <BookColumn
              key={shelf.status}
              title={shelf.title}
              status={shelf.status}
              iconSrc={shelf.iconSrc}
              books={booksByShelf[shelf.status] || []}
              count={shelfCounts[shelf.status]}
              shelves={SHELVES}
              onMoveBook={handleMoveBook}
              onDeleteBook={handleDeleteBook}
              onRateBook={handleRateBook}
            />
          ))}
        </div>
      </main>

      <Routes>
        <Route
          path="/add"
          element={
            <AddBookModal
              onClose={() => navigate('/')}
              onAddBook={handleAddBook}
            />
          }
        />
        <Route path="*" element={null} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<ReadingTracker />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
