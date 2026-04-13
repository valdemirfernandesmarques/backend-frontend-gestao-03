<template>
  <div class="reset-senha-page">
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

    // Estados para mostrar/esconder senha
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
          `https://wondrous-duckanoo-1d4650.netlify.app/api/auth/reset-password/${token}`,
          { password: password.value }
        )

        sucesso.value = true

        setTimeout(() => {
          router.push('/login')
        }, 12000)   // 12000 é equivalente a 12 segundos
      } catch (err) {
        error.value =
          err.response?.data?.error ||
          'Token inválido ou expirado.'
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
/* ESTRUTURA BASE E TEMA DARK */
.reset-senha-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #181529; /* Sincronizado com seu login */
  padding: 20px;
}

.reset-box {
  background: #2c2c3e; /* Sincronizado com seu login */
  padding: 40px 30px;
  border-radius: 15px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0,0,0,0.4);
}

h1 {
  margin-bottom: 10px;
  color: #ff3c78; /* Rosa padrão do seu sistema */
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
}

input:focus {
  border-color: #ff3c78;
}

/* BOTÃO DE OLHO (UX) */
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

.btn-primary:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-primary:disabled {
  background-color: #4b5563;
  cursor: not-allowed;
}

/* MENSAGENS */
.success-container {
  margin-top: 15px;
  color: #2ecc71;
}

.success-icon {
  font-size: 40px;
  margin-bottom: 10px;
}

.redirect-text {
  display: block;
  font-size: 12px;
  color: #94a3b8;
  margin-top: 10px;
}

.btn-login {
  display: inline-block;
  margin-top: 20px;
  color: #ff3c78;
  text-decoration: none;
  font-weight: bold;
}

.error-message {
  margin-top: 15px;
  color: #ff6b81;
  font-size: 14px;
  background: rgba(255, 107, 129, 0.1);
  padding: 10px;
  border-radius: 5px;
}

/* RESPONSIVIDADE */
@media (max-width: 480px) {
  .reset-box {
    padding: 30px 20px;
  }
  
  h1 {
    font-size: 20px;
  }
}
</style>