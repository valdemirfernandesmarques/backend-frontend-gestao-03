<!-- frontend/src/views/ResetSenha.vue -->
<template>
  <div class="reset-senha-page">
    <div class="reset-senha-box">
      <h1>Redefinir Senha</h1>
      <p>Informe a nova senha para sua conta.</p>

      <form @submit.prevent="resetarSenha">
        <div class="form-group">
          <label for="password">Nova Senha</label>
          <input type="password" id="password" v-model="password" required />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirmar Senha</label>
          <input type="password" id="confirmPassword" v-model="confirmPassword" required />
        </div>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Alterando...' : 'Alterar Senha' }}
        </button>
      </form>

      <p v-if="success" class="success">{{ success }}</p>
      <p v-if="error" class="error">{{ error }}</p>

      <router-link to="/login" class="back-login">
        Voltar para o login
      </router-link>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'

export default {
  name: 'ResetSenha',
  setup() {
    const password = ref('')
    const confirmPassword = ref('')
    const loading = ref(false)
    const success = ref('')
    const error = ref('')

    const route = useRoute()
    const token = route.params.token // token vindo do link

    async function resetarSenha() {
      error.value = ''
      success.value = ''

      if (password.value !== confirmPassword.value) {
        error.value = 'As senhas não coincidem.'
        return
      }

      loading.value = true

      try {
        const response = await axios.post(
          `http://localhost:3000/auth/reset-password/${token}`,
          { password: password.value }
        )
        success.value = response.data.message
      } catch (err) {
        error.value = err.response?.data?.error || 'Erro ao redefinir senha.'
      } finally {
        loading.value = false
      }
    }

    return { password, confirmPassword, loading, success, error, resetarSenha }
  }
}
</script>

<style scoped>
.reset-senha-page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f0f2f5;
}

.reset-senha-box {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0px 4px 8px rgba(0,0,0,0.1);
  width: 350px;
  text-align: center;
}

h1 {
  font-size: 20px;
  margin-bottom: 10px;
  color: #333;
}

p {
  font-size: 14px;
  color: #555;
}

.form-group {
  text-align: left;
  margin-bottom: 15px;
}

input {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ddd;
  border-radius: 8px;
  outline: none;
}

button {
  width: 100%;
  padding: 12px;
  background-color: dodgerblue;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;
  font-size: 16px;
}

button:disabled {
  background-color: #7aaee8;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #1a75d1;
}

.success {
  color: green;
  margin-top: 10px;
}

.error {
  color: red;
  margin-top: 10px;
}

.back-login {
  display: block;
  margin-top: 15px;
  font-size: 14px;
  color: #1a75d1;
  text-decoration: none;
}
</style>
