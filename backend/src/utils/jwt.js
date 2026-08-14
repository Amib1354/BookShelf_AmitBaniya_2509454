import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';

export const generateToken = (user) => {
  // Payload includes user ID and any other needed claims
  return jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, JWT_SECRET, {
    expiresIn: '7d',
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
