<template>
  <div class="reset-senha-page">
    <div class="main-wrapper">
      <div class="reset-box">
        <h1>Redefinir Senha</h1>

        <p v-if="!sucesso" class="description">
          Informe sua nova senha abaixo para recuperar o acesso.
        </p>

        <form v-if="!sucesso" @submit.prevent="resetarSenha" class="reset-form">
          <div class="form-group">
            <label for="password">Nova senha</label>
            <div class="input-wrapper">
              <input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                required
                minlength="6"
                placeholder="Mínimo 6 caracteres"
              />
              <button type="button" class="toggle-eye" @click="showPassword = !showPassword">
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirmar nova senha</label>
            <div class="input-wrapper">
              <input
                id="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                v-model="confirmPassword"
                required
                minlength="6"
                placeholder="Repita a senha"
              />
              <button type="button" class="toggle-eye" @click="showConfirmPassword = !showConfirmPassword">
                <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>

          <button type="submit" class="btn-primary" :disabled="loading">
            {{ loading ? 'Salvando...' : 'Alterar senha' }}
          </button>
        </form>

        <p v-if="error" class="error-message">{{ error }}</p>

        <div v-if="sucesso" class="success-container">
          <div class="success-icon">✅</div>
          <p>Senha alterada com sucesso!</p>
          <span class="redirect-text">Redirecionando para o login...</span>
          <router-link to="/login" class="btn-login">Voltar agora</router-link>
        </div>
      </div>
    </div>

    <footer class="global-footer">
      <div class="footer-content">
        <div class="footer-spacer"></div>
        <div class="footer-center">
          <p>© 2026 Gestão em Dança. Todos os direitos reservados.</p>
        </div>
        <div class="footer-right">
          <span class="contact-label">CONTATO</span>
          <a href="https://mail.google.com/mail/?view=cm&fs=1&to=gestaoemdanca@gmail.com" target="_blank" class="email-link">
            <span class="email-icon">✉</span>
            <span class="email-text">gestaoemdanca@gmail.com</span>
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

export default {
  name: 'ResetSenha',
  setup() {
    const route = useRoute()
    const router = useRouter()

    const token = route.params.token

    const password = ref('')
    const confirmPassword = ref('')
    const loading = ref(false)
    const error = ref('')
    const sucesso = ref(false)

    const showPassword = ref(false)
    const showConfirmPassword = ref(false)

    async function resetarSenha() {
      error.value = ''
      if (password.value.length < 6) {
        error.value = 'A senha deve ter no mínimo 6 caracteres.'
        return
      }
      if (password.value !== confirmPassword.value) {
        error.value = 'As senhas não coincidem.'
        return
      }

      loading.value = true
      try {
        await axios.post(
          `http://localhost:3000/api/auth/reset-password/${token}`,
          { password: password.value }
        )
        sucesso.value = true
        setTimeout(() => {
          router.push('/login')
        }, 12000)
      } catch (err) {
        error.value = err.response?.data?.error || 'Token inválido ou expirado.'
      } finally {
        loading.value = false
      }
    }

    return {
      password,
      confirmPassword,
      loading,
      error,
      sucesso,
      showPassword,
      showConfirmPassword,
      resetarSenha
    }
  }
}
</script>

<style scoped>
/* ESTRUTURA PARA FORÇAR O RODAPÉ PARA BAIXO */
.reset-senha-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #181529; /* Seu fundo dark original */
}

.main-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.reset-box {
  background: #2c2c3e;
  padding: 40px 30px;
  border-radius: 15px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0,0,0,0.4);
}

h1 {
  margin-bottom: 10px;
  color: #ff3c78; /* Seu rosa original */
  font-size: 24px;
}

.description {
  font-size: 14px;
  color: #ddd;
  margin-bottom: 25px;
}

/* FORMULÁRIO */
.form-group {
  text-align: left;
  margin-bottom: 20px;
}

label {
  display: block;
  font-size: 14px;
  margin-bottom: 8px;
  color: #fff;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

input {
  width: 100%;
  padding: 12px 45px 12px 15px;
  border-radius: 8px;
  border: 1px solid #444;
  background: #181529;
  color: white;
  outline: none;
  font-size: 16px;
  box-sizing: border-box;
}

input:focus {
  border-color: #ff3c78;
}

.toggle-eye {
  position: absolute;
  right: 15px;
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
}

.toggle-eye:hover {
  color: #ff3c78;
}

.btn-primary {
  width: 100%;
  padding: 14px;
  background-color: #ff3c78;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: opacity 0.3s;
}

/* RODAPÉ GLOBAL (ESTILO PADRÃO DO SISTEMA) */
.global-footer {
  background-color: #1a1a1a;
  border-top: 1px solid #333;
  padding: 15px 0;
  width: 100%;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
}

.footer-spacer, .footer-center, .footer-right { flex: 1; }
.footer-center { text-align: center; }
.footer-center p { color: white; margin: 0; font-size: 0.85rem; }
.footer-right { display: flex; flex-direction: column; align-items: flex-end; }
.contact-label { color: #2563eb; font-weight: bold; font-size: 0.65rem; }
.email-link { color: white; text-decoration: none; font-size: 0.85rem; display: flex; align-items: center; gap: 5px; }

/* MENSAGENS E SUCESSO */
.error-message {
  margin-top: 15px;
  color: #ff6b81;
  font-size: 14px;
  background: rgba(255, 107, 129, 0.1);
  padding: 10px;
  border-radius: 5px;
}

.success-container { margin-top: 15px; color: #2ecc71; }
.success-icon { font-size: 40px; margin-bottom: 10px; }
.btn-login { display: inline-block; margin-top: 20px; color: #ff3c78; text-decoration: none; font-weight: bold; }

/* RESPONSIVIDADE */
@media (max-width: 768px) {
  .main-wrapper { padding: 20px 15px; }
  .footer-content { flex-direction: column; gap: 10px; padding: 0 20px; }
  .footer-right { align-items: center; }
  .footer-spacer { display: none; }
  .reset-box { padding: 30px 20px; }
}
</style>