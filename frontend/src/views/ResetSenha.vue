<template>
  <div class="reset-senha-page">
    <div class="reset-box">
      <h1>Redefinir Senha</h1>

      <p v-if="!sucesso">
        Informe sua nova senha abaixo.
      </p>

      <form v-if="!sucesso" @submit.prevent="resetarSenha">
        <div class="form-group">
          <label for="password">Nova senha</label>
          <input
            id="password"
            type="password"
            v-model="password"
            required
            minlength="6"
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirmar nova senha</label>
          <input
            id="confirmPassword"
            type="password"
            v-model="confirmPassword"
            required
            minlength="6"
          />
        </div>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Salvando...' : 'Alterar senha' }}
        </button>
      </form>

      <p v-if="error" class="error">{{ error }}</p>

      <div v-if="sucesso" class="success">
        <p>✅ Senha alterada com sucesso!</p>
        <router-link to="/login">Voltar para o login</router-link>
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

        // redirecionamento opcional automático
        setTimeout(() => {
          router.push('/login')
        }, 3000)
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
      resetarSenha
    }
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

.reset-box {
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 360px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

h1 {
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

label {
  display: block;
  font-size: 14px;
  margin-bottom: 5px;
  color: #444;
}

input {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

button {
  width: 100%;
  padding: 12px;
  background-color: dodgerblue;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
}

button:disabled {
  background-color: #8bb6f0;
  cursor: not-allowed;
}

.success {
  margin-top: 15px;
  color: green;
}

.success a {
  display: inline-block;
  margin-top: 10px;
  color: dodgerblue;
  text-decoration: none;
}

.error {
  margin-top: 10px;
  color: red;
}
</style>
