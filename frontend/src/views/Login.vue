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

        <div class="signup-link">
          <span>Não tem uma conta? </span>
          <router-link to="/ativacao" class="link-text">Inscrever-se</router-link>
        </div>

        <div class="forgot-password">
          <router-link to="/forgot-password">Esqueci minha senha</router-link>
        </div>

        <p class="error" v-if="error">{{ error }}</p>
      </form>
    </div>

    <footer class="footer">
      <div class="footer-container">
        <div class="footer-side"></div>

        <div class="footer-center">
          <p>© 2026 Gestão em Dança. Todos os direitos reservados.</p>
        </div>

        <div class="footer-right">
          <span class="contato-label">CONTATO</span>
          <a href="https://mail.google.com/mail/?view=cm&fs=1&to=gestaoemdanca@gmail.com" target="_blank" class="email-link">
            <span class="email-icon">✉</span>
            gestaoemdanca@gmail.com
          </a>
        </div>
      </div>
    </footer>
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
    const payload = JSON.parse(atob(token.split('.')[1]))

    localStorage.clear()
    localStorage.setItem('token', token)
    localStorage.setItem('role', payload.perfil)
    
    if (payload.escolaId) {
      localStorage.setItem('escolaId', payload.escolaId)
      try {
        const escolaRes = await api.get(`/escolas/${payload.escolaId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (escolaRes.data && escolaRes.data.nome) {
          localStorage.setItem('nomeEscola', escolaRes.data.nome)
        }
      } catch (eError) {
        console.error('Erro ao buscar nome da escola:', eError)
      }
    }

    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    router.push(payload.perfil === 'SUPER_ADMIN' ? '/super' : '/escola')

  } catch (err) {
    console.error('Erro no login:', err)
    error.value = err.response?.data?.error || 'Credenciais inválidas.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Estrutura Principal */
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #181529;
  position: relative;
  padding-bottom: 80px; 
}

.login-box {
  background: #2c2c3e;
  padding: 2.5rem;
  border-radius: 12px;
  width: 350px;
  text-align: center;
  z-index: 1;
}

h1 { color: #ff3c78; margin-bottom: 1.5rem; }
.form-group { text-align: left; margin-bottom: 1rem; }
label { color: #fff; display: block; margin-bottom: 5px; }
input {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border-radius: 8px;
  border: 1px solid #444;
  background: #fff;
  box-sizing: border-box;
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
}

/* Links */
.signup-link { margin-top: 15px; color: #ccc; font-size: 0.9rem; }
.link-text { color: #ff3c78; text-decoration: none; font-weight: bold; }
.forgot-password { margin-top: 1rem; }
.forgot-password a { color: #bbb; font-size: 0.85rem; text-decoration: none; }
.error { margin-top: 10px; color: #ff6b81; }

/* --- RODAPÉ AJUSTADO --- */
.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #1b1b2f;
  padding: 15px 0;
  border-top: 1px solid #333;
  z-index: 100;
}

.footer-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
}

.footer-side, .footer-center, .footer-right {
  flex: 1;
}

.footer-center {
  text-align: center;
}

.footer-center p {
  color: #ffffff;
  margin: 0;
  font-size: 14px;
}

.footer-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.contato-label {
  color: #3498db;
  font-weight: bold;
  font-size: 10px;
  margin-bottom: 2px;
}

.email-link {
  color: #ffffff !important;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  cursor: pointer;
  position: relative;
  z-index: 101;
}

.email-link:hover {
  text-decoration: underline;
  color: #ff3c78 !important;
}

.email-icon { font-size: 16px; }

/* RESPONSIVIDADE */
@media (max-width: 768px) {
  .footer-container {
    flex-direction: column;
    gap: 10px;
    padding: 10px;
  }
  .footer-right { align-items: center; }
  .footer-side { display: none; }
  .login-box { width: 90%; }
}
</style>