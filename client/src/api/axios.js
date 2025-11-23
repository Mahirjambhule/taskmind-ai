import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api', // The address of your backend
});

// Automatically add the Token to every request if we have one
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;