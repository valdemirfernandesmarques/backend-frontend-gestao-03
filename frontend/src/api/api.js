import axios from 'axios';

const api = axios.create({
  // URL do seu Backend no Render (Sempre use o link que termina em .onrender.com)
  baseURL: 'https://backend-frontend-gestao-03.onrender.com/api',
  timeout: 10000,
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

// 🛡️ Interceptor de Resposta: Se o acesso expirar (erro 401), limpa os dados
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