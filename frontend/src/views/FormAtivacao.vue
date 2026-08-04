<template>
  <div class="activation-page">
    <div class="main-content">
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
                <div class="field full-width">
                  <label class="custom-label">Nome da escola</label>
                  <input v-model="form.nomeEscola" type="text" required class="custom-input" placeholder="Nome da sua institution" />
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

    <footer class="global-footer">
      <div class="footer-content">
        <div class="footer-spacer"></div>
        
        <div class="footer-center">
          <p>© 2026 Gestão em Dança. Todos os direitos reservados.</p>
        </div>

        <div class="footer-right">
          <span class="contact-label">CONTATO</span>
          <a 
            href="https://mail.google.com/mail/?view=cm&fs=1&to=gestaoemdanca@gmail.com" 
            target="_blank" 
            class="email-link"
          >
            <span class="email-icon">✉</span>
            <span class="email-text">gestaoemdanca@gmail.com</span>
          </a>
        </div>
      </div>
    </footer>
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
        localStorage.setItem('nomeEscola', this.form.nomeEscola)
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
/* Estilos Gerais de Layout */
.activation-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #131129;
}

.main-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.activation-container {
  width: 100%;
  max-width: 650px;
}

.activation-card {
  background: #1c1a36;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  overflow: hidden;
  border: 1px solid #2d2a4a;
}

.card-header {
  background-color: #2563eb;
  color: white;
  padding: 30px;
  text-align: center;
}

.card-header h1 { font-size: 1.8rem; font-weight: bold; margin: 0; }
.card-header p { opacity: 0.9; margin-top: 5px; }

.card-body { padding: 40px; }

/* CENTRALIZAÇÃO DO CONTEÚDO AZUL (FIELDSETS) */
.form-container {
  display: flex;
  flex-direction: column;
  align-items: center; 
  gap: 30px;
}

.form-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center; 
}

.section-title {
  font-size: 1.1rem;
  color: #60a5fa;
  font-weight: 600;
  border-bottom: 1px solid #2d2a4a;
  padding-bottom: 10px;
  margin-bottom: 20px;
  width: 100%;
  text-align: center; /* Centraliza o título azul conforme pedido */
}

.input-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  width: 100%;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left; 
}

.full-width { width: 100%; }

.custom-label { font-size: 1rem; color: #ffffff; font-weight: 600; }

.custom-input {
  width: 100%;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid #3e3b63;
  background: #131129;
  color: white;
  font-size: 0.95rem;
  box-sizing: border-box;
}

/* LINKS: RESTAURAÇÃO DAS CORES ORIGINAIS */
.terms-section {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 10px 0;
}

.terms-label {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #a1a1aa;
  font-size: 0.9rem;
  cursor: pointer;
}

.terms-link {
  color: #3b82f6; /* Azul original restaurado */
  text-decoration: underline;
  font-weight: 500;
}

.terms-link:hover {
  color: #60a5fa;
}

/* Botão de Ação */
.actions { width: 100%; display: flex; justify-content: center; }

.btn-cta {
  width: 100%;
  max-width: 400px;
  background: #2563eb;
  color: white;
  padding: 16px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: transform 0.2s, background 0.3s;
}

.btn-cta:hover { background: #1d4ed8; transform: translateY(-2px); }

/* RODAPÉ ESTILO "FICA NO MEIO" */
.global-footer {
  background-color: #1a1a1a;
  padding: 20px 0;
  border-top: 1px solid #333;
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
.footer-center p { color: white; margin: 0; font-size: 0.9rem; }

.footer-right { 
  display: flex; 
  flex-direction: column; 
  align-items: flex-end; 
}

.contact-label { 
  color: #2563eb; 
  font-weight: bold; 
  font-size: 0.75rem; 
  margin-bottom: 2px;
}

.email-link { 
  color: white; 
  text-decoration: none; 
  font-size: 0.9rem; 
  display: flex; 
  align-items: center; 
  gap: 8px; 
}

/* Responsividade Completa (Mobile, Tablet, Desktop) */
@media (max-width: 768px) {
  .input-group { grid-template-columns: 1fr; }
  .footer-content { flex-direction: column; gap: 15px; text-align: center; }
  .footer-right { align-items: center; }
  .footer-spacer { display: none; }
  .card-body { padding: 25px 20px; }
  .card-header h1 { font-size: 1.5rem; }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .activation-container { max-width: 90%; }
}
</style>