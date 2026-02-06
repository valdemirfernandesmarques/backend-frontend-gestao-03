// arquivo: src/api/api.js
import axios from 'axios';

const api = axios.create({
  // Em produção, o Render usará a VITE_API_URL que cadastraremos no painel.
  // Caso contrário, ele tenta usar o IP local para seus testes em casa.
  baseURL: import.meta.env.VITE_API_URL || 'http://192.168.100.248:3000/api',
  timeout: 15000, // Aumentei um pouco o timeout pois serviços gratuitos podem demorar a "acordar"
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
      // Opcional: window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;