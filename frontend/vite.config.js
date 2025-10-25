import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      // Qualquer requisição que comece com /api será redirecionada
      '/api': {
        target: 'http://localhost:3000', // O endereço do seu backend
        changeOrigin: true, // Essencial para o proxy funcionar corretamente
      }
    }
  }
})