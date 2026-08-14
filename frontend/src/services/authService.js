import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  || (import.meta.env.PROD ? '/.netlify/functions/api/api' : 'http://localhost:3001/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export async function loginUser(credentials) {
  const response = await api.post('/auth/login', credentials);
  if (response.data?.data?.token) {
    localStorage.setItem('user', JSON.stringify(response.data.data));
    localStorage.setItem('token', response.data.data.token);
  }
  return response.data;
}

export async function registerUser(userData) {
  const response = await api.post('/auth/register', userData);
  if (response.data?.data?.token) {
    localStorage.setItem('user', JSON.stringify(response.data.data));
    localStorage.setItem('token', response.data.data.token);
  }
  return response.data;
}

export async function fetchCurrentUser() {
  const response = await api.get('/auth/me');
  return response.data;
}

export function logoutUser() {
  api.post('/auth/logout').catch(() => {});
  localStorage.removeItem('user');
  localStorage.removeItem('token');
}

export function getCurrentUser() {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (err) {
    return null;
  }
}

export function getToken() {
  return localStorage.getItem('token');
}
