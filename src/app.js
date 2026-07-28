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
    const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000', process.env.FRONTEND_URL].filter(Boolean);
    if (
      !origin || 
      allowedOrigins.includes(origin) || 
      origin.endsWith('.onrender.com') ||
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.netlify.app') ||
      origin.endsWith('.github.io')
    ) {
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



app.get('/health', (req, res) => res.status(200).json({ ok: true }));

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
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

export default app;
