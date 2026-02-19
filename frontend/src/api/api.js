// arquivo: src/api/api.js
import axios from 'axios';

const api = axios.create({
  // Ajustado para HTTPS para funcionar no Netlify com seu domínio próprio
  // O link abaixo aponta para o seu servidor de processamento no Render
  baseURL: import.meta.env.VITE_API_URL || 'https://api-gestao-danca.onrender.com/api', 
  timeout: 15000, 
});

// 🔐 Interceptor Dinâmico: Envia o token em todas as requisições
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

// 🛡️ Interceptor de Resposta: Limpa dados se o acesso for negado
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
    }
    return Promise.reject(error);
  }
);

export default api;