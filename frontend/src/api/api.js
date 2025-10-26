// arquivo: src/api/api.js
import axios from 'axios';

// ATENÇÃO: Definindo o BASE_URL para incluir o prefixo /api que o backend espera.
// Se VITE_API_BASE_URL estiver definido, ele será usado. Caso contrário, usamos o padrão.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'; 

// Cria a instância do Axios apontando para a URL do backend
const api = axios.create({
  baseURL: BASE_URL,
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