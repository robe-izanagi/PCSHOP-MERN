// frontend/src/api.js
import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || 'https://pcshop-mern-backend-2.onrender.com';

const api = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' }
});

// debug — shows outgoing requests (remove later if noisy)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  // debug log
  console.debug('[API REQUEST]', config.method?.toUpperCase(), (config.baseURL || '') + (config.url || ''), 'headers:', config.headers);
  return config;
}, (err) => Promise.reject(err));

api.interceptors.response.use(r => r, err => {
  console.error('[API ERROR]', err?.response?.status, err?.response?.data || err.message);
  return Promise.reject(err);
});

export default api;
