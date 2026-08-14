import { generateToken } from '../utils/jwt.js';
import bcrypt from 'bcrypt';
import User from '../models/userModel.js';

const cookieOptions = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000
};

export const getUserById = async (id) => {
  const user = await User.findById(id);
  return user;
};

export async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please provide name, email, and password.' });
    }
    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'User with this email already exists.' });
    }
    const user = await User.create({ name, email, password });
    const userObj = user.toObject();
    delete userObj.password;
    const token = generateToken(user);
    res.cookie('jwtToken', token, cookieOptions);
    return res.status(201).json({ message: 'User registered successfully', data: { ...userObj, token } });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Server error during registration.' });
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password.' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    const userObj = user.toObject();
    delete userObj.password;
    const token = generateToken(user);
    res.cookie('jwtToken', token, cookieOptions);
    return res.status(200).json({ message: 'Login successful', data: { ...userObj, token } });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error during login.' });
  }
}

export const getCurrentUser = async (req, res) => {
  try {
    const user = await getUserById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      data: {
        _id: user._id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie('jwtToken', cookieOptions);
  return res.status(200).json({ message: 'Logged out successfully' });
};
