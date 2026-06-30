import React from 'react';
import bookshelfIcon from '../assets/bookshelf.png';
import readingBookIcon from '../assets/reading-book.png';
import wantToReadIcon from '../assets/want to read.png';

export default function BookCard({ title, author, status, rating }) {
  // Dynamic color themes based on reading status
  const statusStyles = {
    'Want to Read': 'bg-amber-50 text-amber-700 border-amber-200/60',
    'Reading': 'bg-blue-50 text-blue-700 border-blue-200/60',
    'Finished': 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
  };
  const statusIcons = {
    'Want to Read': wantToReadIcon,
    'Reading': readingBookIcon,
    'Finished': bookshelfIcon
  };
  const statusIcon = statusIcons[status] || readingBookIcon;

  return (
    <div className="group relative bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_-3px_rgba(0,0,0,0,05)] hover:shadow-[0_12px_20px_-8px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between h-48 overflow-hidden">
      
      {/* Decorative subtle gradient hover effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex justify-between items-start gap-2 mb-3">
          <span className={`text-[11px] font-semibold tracking-wide px-2.5 py-1 rounded-md border ${statusStyles[status]}`}>
            {status}
          </span>
          
          {status === 'Finished' && rating && (
            <div className="flex items-center gap-0.5 bg-amber-50/80 backdrop-blur-xs px-2 py-0.5 rounded-md border border-amber-100 text-amber-500 text-xs font-bold shadow-xs">
              <span className="text-amber-400">★</span> {rating}.0
            </div>
          )}
        </div>

        <h4 className="font-bold text-slate-800 text-base leading-snug tracking-tight group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
          {title}
        </h4>
        <p className="text-xs font-medium text-slate-400 mt-1">by <span className="text-slate-500">{author}</span></p>
      </div>

      {/* Styled Book Spine/Cover Art Placeholder */}
      <div className="relative z-10 mt-4 flex items-center gap-3 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 group-hover:bg-white group-hover:border-slate-200 transition-all duration-300">
        <div className={`w-7 h-9 rounded-md flex items-center justify-center text-xs shadow-xs text-white font-bold bg-gradient-to-br ${
          status === 'Want to Read' ? 'from-amber-400 to-orange-400' :
          status === 'Reading' ? 'from-blue-500 to-indigo-500' :
          'from-emerald-400 to-teal-500'
        }`}>
          <img src={statusIcon} alt="" className="h-6 w-6 object-contain drop-shadow-sm" />
        </div>
        <span className="text-[11px] font-medium text-slate-400 tracking-wide uppercase">Digital Edition</span>
      </div>
    </div>
  );
}
