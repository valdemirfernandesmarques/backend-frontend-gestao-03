// frontend/src/main.js (CORRIGIDO)

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/style.css' // 👈 LINHA ADICIONADA PARA IMPORTAR O CSS GLOBAL

const app = createApp(App)

app.use(router)
app.mount('#app')