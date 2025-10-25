<template>
  <div class="login-page">
    <div class="login-box">
      <h1>Gestão em Dança</h1>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">E-mail</label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            placeholder="Digite seu e-mail"
          />
        </div>

        <div class="form-group">
          <label for="senha">Senha</label>
          <input
            type="password"
            id="senha"
            v-model="password"
            required
            placeholder="Digite sua senha"
          />
        </div>

        <button type="submit" :disabled="loading">
          {{ loading ? "Entrando..." : "Entrar" }}
        </button>

        <p class="error" v-if="error">{{ error }}</p>
        <router-link to="/recuperar-senha" class="forgot">
          Esqueci minha senha
        </router-link>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api/api.js';

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);
const router = useRouter();

const handleLogin = async () => {
  loading.value = true;
  error.value = '';

  try {
    const response = await api.post("/auth/login", {
      email: email.value,
      password: password.value,
    });

    const { token } = response.data;

    if (!token) {
      error.value = "Token não recebido do servidor.";
      loading.value = false;
      return;
    }

    // Decodifica o payload do JWT para extrair as informações do usuário
    const payload = JSON.parse(atob(token.split(".")[1]));

    // Limpa o localStorage antes de salvar novos dados
    localStorage.clear();

    // Armazena as informações no localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("role", payload.perfil);
    
    // 👇 AJUSTE CRÍTICO: SALVANDO O ESCOLA ID DE DENTRO DO TOKEN 👇
    if (payload.escolaId) {
      localStorage.setItem("escolaId", payload.escolaId);
    }

    // Redireciona conforme o perfil do usuário
    if (payload.perfil === "SUPER_ADMIN") {
      router.push("/super");
    } else if (payload.perfil === "ADMIN_ESCOLA") {
      router.push("/escola");
    } else {
      error.value = "Perfil não autorizado para acesso.";
    }

  } catch (err) {
    console.error("Erro no login:", err);
    if (err.response?.data?.error) {
      error.value = err.response.data.error;
    } else {
      error.value = "E-mail ou senha incorretos. Tente novamente.";
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Seu CSS aqui, sem alterações */
.login-page { display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #181529; font-family: 'Poppins', sans-serif; }
.login-box { background: #2c2c3e; padding: 2.5rem; border-radius: 12px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3); width: 350px; text-align: center; }
h1 { font-family: 'Great Vibes', cursive; color: #ff3c78; margin-bottom: 1.5rem; font-size: 28px; }
.form-group { text-align: left; margin-bottom: 1rem; }
label { font-size: 14px; color: #fff; }
input { width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #555; border-radius: 8px; outline: none; background-color: #1f1f1f; color: #fff; }
input:focus { border-color: #ff3c78; }
button { width: 100%; padding: 12px; background-color: #ff3c78; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; margin-top: 10px; transition: 0.3s; }
button:hover:not(:disabled) { background-color: #e83266; }
button:disabled { background-color: #ff7eb3; cursor: not-allowed; }
.error { margin-top: 10px; color: #ff6b81; font-size: 14px; }
.forgot { display: block; margin-top: 15px; font-size: 14px; color: #ff3c78; text-decoration: none; }
</style>