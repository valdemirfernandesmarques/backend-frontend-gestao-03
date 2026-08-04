<template>
  <div class="recuperar-senha-page">
    <div class="recuperar-box">
      <h1>Recuperar Senha</h1>
      <p class="description">
        Informe o seu e-mail para receber um link de redefinição de senha.
      </p>

      <form @submit.prevent="enviarEmail" class="recuperar-form">
        <div class="form-group">
          <label for="email">E-mail</label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            placeholder="Digite seu e-mail cadastrado"
          />
        </div>

        <button type="submit" :disabled="loading" class="btn-enviar">
          {{ loading ? 'Enviando...' : 'Enviar' }}
        </button>
      </form>

      <p v-if="success" class="success">{{ success }}</p>
      <p v-if="error" class="error">{{ error }}</p>
      
      <div class="footer-link">
        <router-link to="/login">Voltar para o Login</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/api/api' 

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
/* ESTRUTURA GLOBAL E RESPONSIVIDADE */
.recuperar-senha-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #181529; /* Cor mantida */
  padding: 20px;
}

.recuperar-box {
  background: #2c2c3e; /* Cor mantida */
  padding: 40px 30px;
  border-radius: 12px;
  box-shadow: 0px 10px 25px rgba(0,0,0,0.4);
  width: 100%;
  max-width: 400px; /* Largura profissional para Desktop */
  text-align: center;
  transition: all 0.3s ease;
}

h1 {
  font-size: 24px;
  margin-bottom: 15px;
  color: #ff3c78; /* Cor mantida */
  font-weight: bold;
}

.description {
  font-size: 14px;
  color: #ddd; /* Cor mantida */
  margin-bottom: 25px;
  line-height: 1.5;
}

.recuperar-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  text-align: left;
}

label {
  font-size: 14px;
  color: #fff; /* Cor mantida */
  display: block;
  margin-bottom: 8px;
}

input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #444; /* Cor mantida */
  border-radius: 8px;
  background: #181529; /* Fundo do input levemente mais escuro */
  color: white;
  outline: none;
  font-size: 16px; /* Melhor para leitura no mobile */
  transition: border-color 0.3s;
}

input:focus {
  border-color: #ff3c78;
}

.btn-enviar {
  width: 100%;
  padding: 14px;
  background-color: #ff3c78; /* Cor mantida */
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: opacity 0.3s, transform 0.2s;
}

.btn-enviar:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-enviar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.footer-link {
  margin-top: 20px;
}

.footer-link a {
  color: #94a3b8;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.footer-link a:hover {
  color: #ff3c78;
}

.success {
  color: #2ecc71; /* Cor mantida */
  margin-top: 15px;
  font-size: 14px;
}

.error {
  color: #ff6b81; /* Cor mantida */
  margin-top: 15px;
  font-size: 14px;
}

/* --- MEDIA QUERIES PARA MOBILE --- */
@media (max-width: 480px) {
  .recuperar-box {
    padding: 30px 20px;
    border-radius: 10px;
  }

  h1 {
    font-size: 20px;
  }

  input, .btn-enviar {
    font-size: 15px;
  }
}
</style>