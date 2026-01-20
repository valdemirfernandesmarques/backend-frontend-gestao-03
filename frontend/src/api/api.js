// arquivo: src/api/api.js
import axios from 'axios';

const api = axios.create({
  // Usa variável de ambiente ou o próprio host para não quebrar em produção/rede local
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
 //baseURL: import.meta.env.VITE_API_URL || 'http://192.168.100.248:3000/api',
  timeout: 10000,
});

// 🔐 Interceptor Dinâmico: Pega o token atualizado a cada requisição
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

// 🛡️ Interceptor de Resposta: Se der 401, força logout para evitar estado inconsistente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      // Não redirecionamos aqui para não quebrar fluxos específicos, 
      // mas limpamos os dados para segurança.
    }
    return Promise.reject(error);
  }
);

export default api;