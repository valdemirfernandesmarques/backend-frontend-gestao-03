// arquivo: src/api/api.js
import axios from 'axios';

const api = axios.create({
  // Atualizado para o novo link do Render que está funcionando
  baseURL: 'https://api-gestao-danca.onrender.com/api',
  timeout: 30000, // Aumentado para 30s pois o Render gratuito "dorme" e demora a responder na primeira vez
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

// 🛡️ Interceptor de Resposta: Se der 401, força logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      // Descomente a linha abaixo se quiser que ele redirecione para o login automaticamente
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;