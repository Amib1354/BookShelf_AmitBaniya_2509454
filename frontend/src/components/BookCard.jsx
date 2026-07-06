import React from 'react';
import bookshelfIcon from '../assets/bookshelf.png';
import readingBookIcon from '../assets/reading-book.png';
import wantToReadIcon from '../assets/want to read.png';

const statusLabels = {
  want: 'Want to Read',
  reading: 'Reading',
  finished: 'Finished'
};

function StarRating({ rating = 0, onRate }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRate(star)}
          className={`text-sm leading-none transition-colors ${
            star <= rating ? 'text-amber-400' : 'text-slate-300 hover:text-amber-300'
          }`}
          aria-label={`Rate ${star} stars`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function BookCard({
  book,
  shelves,
  currentStatus,
  onMoveBook,
  onDeleteBook,
  onRateBook
}) {
  const { id, title, author, genre, status, rating } = book;
  const statusStyles = {
    want: 'bg-amber-50 text-amber-700 border-amber-200/60',
    reading: 'bg-blue-50 text-blue-700 border-blue-200/60',
    finished: 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
  };
  const statusIcons = {
    want: wantToReadIcon,
    reading: readingBookIcon,
    finished: bookshelfIcon
  };
  const statusIcon = statusIcons[status] || readingBookIcon;
  const moveTargets = shelves.filter((shelf) => shelf.status !== currentStatus);

  return (
    <div className="group relative bg-white p-4 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_20px_-8px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between min-h-64 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex justify-between items-start gap-2 mb-3">
          <span className={`text-[11px] font-semibold tracking-wide px-2.5 py-1 rounded-md border ${statusStyles[status]}`}>
            {statusLabels[status]}
          </span>

          {status === 'finished' && (
            <div className="rounded-md border border-amber-100 bg-amber-50/80 px-2 py-1 shadow-xs">
              <StarRating rating={rating} onRate={(nextRating) => onRateBook(id, nextRating)} />
            </div>
          )}
        </div>

        <h4 className="font-bold text-slate-800 text-base leading-snug tracking-tight group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
          {title}
        </h4>
        <p className="text-xs font-medium text-slate-400 mt-1">by <span className="text-slate-500">{author}</span></p>
        <p className="mt-2 inline-flex rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
          {genre}
        </p>
      </div>

      <div className="relative z-10 mt-4 space-y-3">
        <div className="flex items-center gap-3 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 group-hover:bg-white group-hover:border-slate-200 transition-all duration-300">
          <div className={`w-7 h-9 rounded-md flex items-center justify-center text-xs shadow-xs text-white font-bold bg-gradient-to-br ${
            status === 'want' ? 'from-amber-400 to-orange-400' :
            status === 'reading' ? 'from-blue-500 to-indigo-500' :
            'from-emerald-400 to-teal-500'
          }`}>
            <img src={statusIcon} alt="" className="h-6 w-6 object-contain drop-shadow-sm" />
          </div>
          <span className="text-[11px] font-medium text-slate-400 tracking-wide uppercase">Digital Edition</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {moveTargets.map((shelf) => (
            <button
              key={shelf.status}
              type="button"
              onClick={() => onMoveBook(id, shelf.status)}
              className="rounded-lg border border-slate-200 px-2 py-1.5 text-[10px] font-bold text-slate-500 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              Move to {shelf.title}
            </button>
          ))}
          <button
            type="button"
            onClick={() => onDeleteBook(id)}
            className="col-span-2 rounded-lg border border-red-100 px-2 py-1.5 text-[10px] font-bold text-red-500 hover:bg-red-50 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
