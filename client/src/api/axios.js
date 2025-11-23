import axios from 'axios';

// 1. Define the Base URL
// If we are on the web (Production), use the Render URL.
// If we are on laptop (Development), use Localhost.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Helps with session consistency if needed later
});

// 2. Automatically attach Token to every request
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;