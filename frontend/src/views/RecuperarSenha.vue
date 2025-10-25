<template>
  <div class="recuperar-senha-page">
    <div class="recuperar-box">
      <h1>Recuperar Senha</h1>
      <p>Informe o seu e-mail para receber um link de redefinição de senha.</p>

      <form @submit.prevent="enviarEmail">
        <div class="form-group">
          <label for="email">E-mail</label>
          <input type="email" id="email" v-model="email" required />
        </div>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Enviando...' : 'Enviar' }}
        </button>
      </form>

      <p v-if="success" class="success">{{ success }}</p>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'

export default {
  name: 'RecuperarSenha',
  setup() {
    const email = ref('')
    const error = ref('')
    const success = ref('')
    const loading = ref(false)

    async function enviarEmail() {
      error.value = ''
      success.value = ''
      loading.value = true

      try {
        const response = await axios.post('http://localhost:3000/api/auth/recuperar-senha', {
          email: email.value
        })

        success.value = response.data.message
      } catch (err) {
        error.value = err.response?.data?.error || 'Erro ao enviar e-mail.'
      } finally {
        loading.value = false
      }
    }

    return { email, error, success, loading, enviarEmail }
  }
}
</script>

<style scoped>
.recuperar-senha-page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f0f2f5;
}

.recuperar-box {
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

label {
  font-size: 14px;
  color: #555;
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
</style>
