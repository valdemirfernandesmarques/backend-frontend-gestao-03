<template>
  <div class="recuperar-senha-page">
    <div class="recuperar-box">
      <h1>Recuperar Senha</h1>
      <p>
        Informe o seu e-mail para receber um link de redefinição de senha.
      </p>

      <form @submit.prevent="enviarEmail">
        <div class="form-group">
          <label for="email">E-mail</label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
          />
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

<script setup>
import { ref } from 'vue'
import api from '@/api/api' // ✅ USAR A INSTÂNCIA PADRÃO DO PROJETO

const email = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)

const enviarEmail = async () => {
  error.value = ''
  success.value = ''
  loading.value = true

  try {
    const response = await api.post('/auth/forgot-password', {
      email: email.value
    })

    success.value =
      response.data.message ||
      'Se o e-mail existir, você receberá instruções para redefinir a senha.'
  } catch (err) {
    console.error('Erro recuperação senha:', err)
    error.value =
      err.response?.data?.error ||
      'Erro ao solicitar recuperação de senha.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.recuperar-senha-page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #181529;
}

.recuperar-box {
  background: #2c2c3e;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0px 4px 8px rgba(0,0,0,0.3);
  width: 350px;
  text-align: center;
}

h1 {
  font-size: 20px;
  margin-bottom: 10px;
  color: #ff3c78;
}

p {
  font-size: 14px;
  color: #ddd;
}

.form-group {
  text-align: left;
  margin-bottom: 15px;
}

label {
  font-size: 14px;
  color: #fff;
}

input {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #444;
  border-radius: 8px;
  outline: none;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #ff3c78;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;
  font-size: 16px;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.success {
  color: #2ecc71;
  margin-top: 10px;
}

.error {
  color: #ff6b81;
  margin-top: 10px;
}
</style>
