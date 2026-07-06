import React, { useState } from 'react';

export default function AddBookModal({ onClose, onAddBook }) {
  const [form, setForm] = useState({
    title: '',
    author: '',
    genre: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.author.trim() || !form.genre.trim()) {
      return;
    }

    onAddBook({
      title: form.title.trim(),
      author: form.author.trim(),
      genre: form.genre.trim()
    });

    setForm({ title: '', author: '', genre: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Add New Book</h2>
            <p className="text-xs text-slate-500 mt-1">New books start in Want to Read.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
            aria-label="Close add book modal"
          >
            X
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-xs font-semibold text-slate-600">Title</span>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              placeholder="Book title"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-slate-600">Author</span>
            <input
              name="author"
              value={form.author}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              placeholder="Author name"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-slate-600">Genre</span>
            <input
              name="genre"
              value={form.genre}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              placeholder="Genre"
            />
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              Add Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
