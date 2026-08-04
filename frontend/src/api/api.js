// src/api/api.js
import axios from 'axios';

const api = axios.create({
  // URL oficial do seu backend no Render
  baseURL: 'https://api-gestao-danca.onrender.com/api',
  timeout: 30000, 
});

// Interceptor para o Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para Logout em caso de erro 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;