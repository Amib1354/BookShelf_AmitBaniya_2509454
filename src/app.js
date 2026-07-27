import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bookRoutes from './routes/bookRoutes.js';
import authRoutes from './routes/authRoutes.js';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
dotenv.config();
connectDB();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || ['http://localhost:5173'].includes(origin)) {
      return callback(null, true);
    }
    callback(new Error('CORS origin not allowed'));
  },
  credentials: true
}));

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON body.' });
  }

  return next(err);
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
app.use('/auth', authRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

export default app;
