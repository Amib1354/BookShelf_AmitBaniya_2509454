import React from 'react';
import BookCard from './BookCard';

export default function BookColumn({ title, iconSrc, books }) {
  // Distinct accents for the column header dots
  const dotColors = {
    'Want to Read': 'bg-amber-400 ring-amber-100',
    'Reading': 'bg-blue-500 ring-blue-100',
    'Finished': 'bg-emerald-500 ring-emerald-100'
  };

  return (
    <div className="bg-slate-50/70 backdrop-blur-md rounded-2xl p-5 border border-slate-200/50 flex flex-col min-h-[550px] shadow-xs">
      
      {/* Column Header */}
      <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-200/60">
        <div className={`w-2 h-2 rounded-full ring-4 ${dotColors[title] || 'bg-slate-400 ring-slate-100'}`} />
        <img src={iconSrc} alt="" className="h-7 w-7 object-contain" />
        <h3 className="font-bold text-slate-700 tracking-tight text-base">{title}</h3>
        
        <span className="ml-auto bg-white border border-slate-200 text-slate-500 text-xs font-bold px-2 py-0.5 rounded-md shadow-2xs">
          {books.length}
        </span>
      </div>

      {/* Scrollable Container Content */}
      <div className="space-y-3.5 flex-1 overflow-y-auto no-scrollbar">
        {books.map((book) => (
          <BookCard 
            key={book.id}
            title={book.title}
            author={book.author}
            status={book.status}
            rating={book.rating}
          />
        ))}
        
        {books.length === 0 && (
          <div className="h-48 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-4 text-center">
            <img src={iconSrc} alt="" className="h-9 w-9 object-contain opacity-40 mb-1" />
            <p className="text-xs font-semibold text-slate-400">Shelf is completely empty</p>
            <p className="text-[10px] text-slate-400/80 max-w-[150px] mt-0.5">Drop new items here to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
