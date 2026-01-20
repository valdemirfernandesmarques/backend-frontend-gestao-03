<template>
  <div class="activation-page">
    <div class="activation-container">
      <div class="activation-card">

        <div class="card-header">
          <h1>Ativação do Sistema</h1>
          <p>Crie sua escola e comece sua avaliação gratuita</p>
        </div>

        <div class="card-body">

          <form
            v-if="etapa === 1"
            @submit.prevent="ativarConta"
            class="form-container"
          >
            <div class="form-section">
              <h2 class="section-title">👤 Dados do Responsável</h2>
              <div class="input-group">
                <div class="field">
                  <label class="custom-label">Nome completo</label>
                  <input v-model="form.nome" type="text" required class="custom-input" placeholder="Digite seu nome" />
                </div>
                <div class="field">
                  <label class="custom-label">E-mail</label>
                  <input v-model="form.email" type="email" required class="custom-input" placeholder="exemplo@email.com" />
                </div>
              </div>
            </div>

            <div class="form-section">
              <h2 class="section-title">🏫 Dados da Escola</h2>
              <div class="field">
                <label class="custom-label">Nome da escola</label>
                <input v-model="form.nomeEscola" type="text" required class="custom-input" placeholder="Nome da sua instituição" />
              </div>
            </div>

            <div class="terms-section">
              <label class="terms-label">
                <input type="checkbox" v-model="aceitouTermos" required />
                <span>
                  Li e aceito os
                  <router-link to="/termos" target="_blank" class="terms-link">Termos de Uso</router-link>
                  e a
                  <router-link to="/privacidade" target="_blank" class="terms-link">Política de Privacidade</router-link>
                </span>
              </label>
            </div>

            <div class="actions">
              <button
                type="submit"
                :disabled="loading"
                class="btn-cta"
              >
                {{ loading ? 'Ativando...' : 'Ativar Avaliação Gratuita' }}
              </button>
            </div>
          </form>

          <div v-else class="success-container">
            <div class="success-icon">✅</div>
            <h2 class="success-title">Ativação realizada com sucesso!</h2>

            <div class="credentials-box">
              <p><strong>Email:</strong> {{ credenciais.email }}</p>
              <p><strong>Senha:</strong> {{ credenciais.senha }}</p>
            </div>

            <div class="actions">
              <router-link to="/login" class="btn-cta link-button">
                Ir para o Painel de Controle
              </router-link>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api/api'

export default {
  name: 'FormAtivacao',
  data() {
    return {
      etapa: 1,
      loading: false,
      aceitouTermos: false,
      form: {
        nome: '',
        email: '',
        nomeEscola: ''
      },
      credenciais: {
        email: '',
        senha: ''
      }
    }
  },
  methods: {
    async ativarConta() {
      this.loading = true
      try {
        const response = await api.post('/ativacao', this.form)
        this.credenciais = response.data.dadosAcesso
        this.etapa = 2
      } catch (err) {
        console.error('Erro ativação:', err)
        alert('Erro ao realizar ativação. Tente novamente.')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
/* FUNDO DA PÁGINA */
.activation-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #131129; /* Fundo escuro do sistema */
  padding: 20px;
}

.activation-container {
  width: 100%;
  max-width: 650px; /* Largura profissional centralizada */
}

.activation-card {
  background: #1c1a36; /* Card um pouco mais claro que o fundo */
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  overflow: hidden;
  border: 1px solid #2d2a4a;
}

/* HEADER */
.card-header {
  background-color: #2563eb;
  color: white;
  padding: 30px;
  text-align: center;
}

.card-header h1 {
  font-size: 1.8rem;
  font-weight: bold;
  margin: 0;
}

.card-header p {
  opacity: 0.9;
  margin-top: 5px;
}

/* CORPO */
.card-body {
  padding: 40px;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-title {
  font-size: 1.1rem;
  color: #60a5fa;
  font-weight: 600;
  border-bottom: 1px solid #2d2a4a;
  padding-bottom: 10px;
}

.input-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

/* LABELS E INPUTS */
.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.custom-label {
  font-size: 1rem;
  color: #ffffff; /* Texto branco como pedido */
  font-weight: 600;
}

.custom-input {
  width: 100%;
  max-width: 100%;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid #3e3b63;
  background: #131129;
  color: white;
  font-size: 0.95rem;
  transition: border 0.3s;
}

.custom-input:focus {
  outline: none;
  border-color: #2563eb;
}

/* TERMOS */
.terms-section {
  padding: 10px 0;
}

.terms-label {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  color: #a1a1aa;
  font-size: 0.9rem;
  cursor: pointer;
}

.terms-link {
  color: #3b82f6;
  text-decoration: underline;
}

/* BOTÃO CTA PRINCIPAL */
.actions {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.btn-cta {
  width: 100%;
  max-width: 400px; /* Tamanho controlado */
  background: #2563eb;
  color: white;
  padding: 16px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: transform 0.2s, background 0.3s;
  text-align: center;
}

.btn-cta:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
}

.btn-cta:disabled {
  background: #4b5563;
  cursor: not-allowed;
}

/* SUCESSO */
.success-container {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.success-icon {
  font-size: 4rem;
}

.success-title {
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
}

.credentials-box {
  background: #131129;
  border: 1px solid #3b82f6;
  padding: 20px;
  border-radius: 12px;
  text-align: left;
  color: white;
  margin: 10px 0;
}

.credentials-box p {
  margin: 10px 0;
  font-size: 1.1rem;
}

.link-button {
  text-decoration: none;
  display: block;
}

/* RESPONSIVIDADE */
@media (max-width: 600px) {
  .input-group {
    grid-template-columns: 1fr;
  }
  
  .card-body {
    padding: 20px;
  }
}
</style>