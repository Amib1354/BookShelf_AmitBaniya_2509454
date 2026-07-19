import express from 'express';
import bookRoutes from './routes/bookRoutes.js';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
dotenv.config();
connectDB();
const app = express();

app.use(express.json());

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON body.' });
  }

  return next(err);
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  return next();
});

app.get('/', (req, res) => {
  res.json({
    message: 'BookShelf REST API',
    endpoints: [
      'GET /api/books',
      'GET /api/books?status=finished',
      'POST /api/books',
      'PATCH /api/books/:id',
      'DELETE /api/books/:id'
    ]
  });
});

app.use('/api/books', bookRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

export default app;
