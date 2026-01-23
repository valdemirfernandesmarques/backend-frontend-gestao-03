// arquivo: src/api/api.js
import axios from 'axios';

const api = axios.create({
  // URL oficial do seu Backend no Render
  // Substituído 'http://localhost:3000/api' pelo link de produção
  baseURL: 'https://backend-frontend-gestao-03.onrender.com/api',
  timeout: 15000, // Aumentado para 15s para dar tempo do Render gratuito "acordar"
});

// 🔐 Interceptor Dinâmico: Pega o token atualizado a cada requisição para segurança
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

// 🛡️ Interceptor de Resposta: Se o acesso expirar (erro 401), limpa os dados para segurança
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      // Limpa o estado para evitar erros de autenticação inconsistentes
    }
    return Promise.reject(error);
  }
);

export default api;