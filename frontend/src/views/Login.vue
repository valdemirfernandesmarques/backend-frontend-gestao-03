<template>
  <div class="login-page">
    <div class="login-box">
      <h1>Gestão em Dança</h1>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>E-mail</label>
          <input v-model="email" type="email" required />
        </div>

        <div class="form-group">
          <label>Senha</label>
          <input v-model="password" type="password" required />
        </div>

        <button :disabled="loading" type="submit">
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>

        <div class="forgot-password">
          <router-link to="/forgot-password">Esqueci minha senha</router-link>
        </div>

        <p class="error" v-if="error">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/api'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    const res = await api.post('/auth/login', {
      email: email.value,
      password: password.value
    })

    const token = res.data.token
    // Decodifica o payload do JWT para obter perfil e escolaId
    const payload = JSON.parse(atob(token.split('.')[1]))

    // 1. Limpa resíduos e salva novos dados
    localStorage.clear()
    localStorage.setItem('token', token)
    localStorage.setItem('role', payload.perfil)
    
    if (payload.escolaId) {
      localStorage.setItem('escolaId', payload.escolaId)
    }

    // 🚀 AÇÃO CRÍTICA PARA OS GRÁFICOS:
    // Injeta o token diretamente na instância ativa do axios para a primeira requisição do Dashboard
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`

    // 2. Redirecionamento seguro baseado no perfil
    if (payload.perfil === 'SUPER_ADMIN') {
      router.push('/super')
    } else {
      router.push('/escola')
    }

  } catch (err) {
    console.error('Erro no login:', err)
    error.value = err.response?.data?.error || 'Credenciais inválidas.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #181529;
}
.login-box {
  background: #2c2c3e;
  padding: 2.5rem;
  border-radius: 12px;
  width: 350px;
  text-align: center;
}
h1 { color: #ff3c78; margin-bottom: 1.5rem; }
.form-group {
  text-align: left;
  margin-bottom: 1rem;
}
label { color: #fff; display: block; margin-bottom: 5px; }
input {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border-radius: 8px;
  border: 1px solid #444;
  background: #fff;
}
button {
  width: 100%;
  margin-top: 15px;
  padding: 12px;
  background: #ff3c78;
  color: white;
  border-radius: 8px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s;
}
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Estilo do link Esqueci minha senha */
.forgot-password {
  margin-top: 1rem;
}
.forgot-password a {
  color: #bbb;
  font-size: 0.85rem;
  text-decoration: none;
  transition: color 0.2s;
}
.forgot-password a:hover {
  color: #ff3c78;
}

.error {
  margin-top: 10px;
  color: #ff6b81;
}
</style>