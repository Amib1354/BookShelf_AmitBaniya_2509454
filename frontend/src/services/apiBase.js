const RENDER_API_URL = 'https://bookshelf-amitbaniya-2509454.onrender.com/api';

const API_BASE_URL = import.meta.env.PROD
  ? RENDER_API_URL
  : import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export default API_BASE_URL;
