import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate, useLocation, Link } from 'react-router-dom';
import { shelves } from '../data/book';
import AddBookModal from './components/AddBookModal';
import BookColumn from './components/BookColumn';
import booksIcon from './assets/books icon.png';
import bookshelfIcon from './assets/bookshelf.png';
import readingBookIcon from './assets/reading-book.png';
import wantToReadIcon from './assets/want to read.png';
import { getBooks, addBook, updateBook, deleteBook, loadBooks, moveBook } from "./services/bookService";
import { getCurrentUser, logoutUser } from "./services/authService";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const shelfIcons = {
  wantToRead: wantToReadIcon,
  readingBook: readingBookIcon,
  bookshelf: bookshelfIcon
};

const SHELVES = shelves.map((shelf) => ({
  ...shelf,
  iconSrc: shelfIcons[shelf.icon] || readingBookIcon
}));

function Layout({ user, setUser, children }) {
  const navigate = useNavigate();
  const [toggleMenu, setToggleMenu] = useState(false);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <header className="shadow-md py-4 px-4 sm:px-10 bg-white font-sans min-h-[70px] tracking-wide sticky top-0 z-50">
        <div className="flex flex-wrap items-center justify-between gap-4 max-w-7xl mx-auto w-full">
          <Link to="/" className="flex items-center gap-3">
            <img src={booksIcon} alt="Logo" className="w-9 h-9 object-contain" />
            <span className="text-xl font-extrabold text-slate-800 tracking-tight">
              Book<span className="text-blue-600">Shelf</span>
            </span>
          </Link>

          <div
            className={`${
              toggleMenu ? 'block' : 'max-lg:hidden'
            } lg:!flex lg:items-center max-lg:before:fixed max-lg:before:bg-black/50 max-lg:before:inset-0 max-lg:before:z-50`}
          >
            <ul className="lg:flex lg:gap-x-5 max-lg:space-y-3 max-lg:fixed max-lg:bg-white max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50">
              <li className="mb-6 hidden max-lg:block">
                <Link to="/" className="flex items-center gap-2">
                  <img src={booksIcon} alt="Logo" className="w-8 h-8" />
                  <span className="text-lg font-bold text-slate-800">BookShelf</span>
                </Link>
              </li>
              {user && (
                <>
                  <li className="max-lg:border-b max-lg:py-3 px-3">
                    <Link
                      to="/"
                      className="hover:text-blue-600 text-slate-700 font-semibold text-[15px] block transition-all"
                    >
                      My Library
                    </Link>
                  </li>
                  <li className="max-lg:border-b max-lg:py-3 px-3">
                    <Link
                      to="/add"
                      className="hover:text-blue-600 text-slate-700 font-semibold text-[15px] block transition-all"
                    >
                      + Add Book
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                    {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-blue-950 max-sm:hidden">
                    {user.name || user.email}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm rounded-full font-bold text-slate-700 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-all cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm rounded-full font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 text-sm rounded-full font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-sm hover:shadow"
                >
                  Sign up
                </Link>
              </div>
            )}

            <button
              onClick={() => setToggleMenu(!toggleMenu)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </header>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function ReadingTracker({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [books, setBooks] = useState([]);
  const [shelfCounts, setShelfCounts] = useState({
    want: 0,
    reading: 0,
    finished: 0
  });
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBooks(setBooks, setIsLoading, setErrors);
  }, []);

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

  const handleAddBook = async (book) => {
    const res = await addBook(book);
    setBooks((prev) => [res.data, ...prev]);
  };

  const handleMoveBook = (bookId, nextStatus) => {
    if (!bookId) return;
    moveBook(bookId, nextStatus)
      .then((res) => {
        setBooks((prev) =>
          prev.map((b) => (b._id === bookId ? res.data : b))
        );
      })
      .catch((err) => console.error('Move book failed:', err));
  };

  const handleRateBook = (bookId, rating) => {
    updateBook(bookId, { rating })
      .then((res) => {
        setBooks((prev) =>
          prev.map((b) => (b._id === bookId ? res.data : b))
        );
      })
      .catch((err) => console.error('Rate book failed:', err));
  };

  const handleDeleteBook = (bookId) => {
    deleteBook(bookId)
      .then(() => {
        setBooks((prev) => prev.filter((b) => b._id !== bookId));
      })
      .catch((err) => console.error('Delete book failed:', err));
  };

  return (
    <div>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/70 z-50">
          <div className="text-2xl font-bold animate-pulse text-blue-600">Loading library...</div>
        </div>
      )}

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

      {location.pathname === '/add' && (
        <AddBookModal
          onClose={() => navigate('/')}
          onAddBook={handleAddBook}
        />
      )}
    </div>
  );
}

function ProtectedReadingTracker({ user }) {
  if (!user) {
    return <Navigate to="/signup" replace />;
  }
  return <ReadingTracker user={user} />;
}

export default function App() {
  const [user, setUser] = useState(() => getCurrentUser());

  return (
    <BrowserRouter>
      <Layout user={user} setUser={setUser}>
        <Routes>
          <Route path="/" element={<ProtectedReadingTracker user={user} />} />
          <Route path="/add" element={<ProtectedReadingTracker user={user} />} />
          <Route path="/login" element={<Login onAuthSuccess={(userData) => setUser(userData)} />} />
          <Route path="/signup" element={<Signup onAuthSuccess={(userData) => setUser(userData)} />} />
          <Route path="*" element={<Navigate to={user ? "/" : "/signup"} replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
