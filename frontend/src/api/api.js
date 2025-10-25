// arquivo: src/api/api.js
import axios from 'axios';

// Cria a instância do Axios apontando para a URL do backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // Usa a variável do .env ou fallback
  timeout: 10000, // Timeout de 10 segundos
});

// Interceptador para adicionar o token JWT em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
