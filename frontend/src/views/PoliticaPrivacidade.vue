<template>
  <div class="policy-page">
    <div class="main-wrapper">
      <div class="policy-container">
        <div class="policy-card">
          
          <header class="policy-header">
            <h1>Política de Privacidade</h1>
            <p class="subtitle">Conformidade LGPD – Gestão em Dança</p>
            <div class="update-badge">
              Última atualização: 03 de setembro de 2025
            </div>
          </header>

          <div class="policy-content">
            <div class="space-y-8">
              
              <section>
                <h2 class="section-title">1. Papéis no Tratamento de Dados</h2>
                <p>
                  O <strong>Gestão em Dança</strong> atua como <strong>Controlador</strong> para os dados fornecidos no momento do seu cadastro e como <strong>Operador</strong> para os dados de terceiros (alunos e funcionários) inseridos pela escola dentro da plataforma.
                </p>
              </section>

              <section>
                <h2 class="section-title">2. Dados Coletados como Controlador</h2>
                <p>
                  Para a prestação do serviço, coletamos: Nome completo ou razão social, CPF ou CNPJ, e-mail de contato e registros de consentimento (incluindo endereço IP, data e hora da ativação).
                </p>
              </section>

              <section>
                <h2 class="section-title">3. Finalidade do Uso dos Dados</h2>
                <p>Os dados coletados possuem as seguintes finalidades estritas:</p>
                <ul class="policy-list">
                  <li>Ativar e identificar sua conta de acesso;</li>
                  <li>Comunicação institucional e suporte técnico;</li>
                  <li>Aplicação correta da taxa de serviço que é de 0%;</li>
                  <li>Garantia da segurança e conformidade com obrigações legais.</li>
                </ul>
              </section>

              <section>
                <h2 class="section-title">4. Tratamento de Dados como Operador</h2>
                <p>
                  Como operadores, implementamos rigorosas medidas técnicas de segurança para proteger as informações da sua escola. O Gestão em Dança <strong>jamais</strong> utiliza ou compartilha dados inseridos por você para fins próprios ou comerciais.
                </p>
              </section>

              <section>
                <h2 class="section-title">5. Direitos do Titular</h2>
                <p>
                  Em conformidade com a LGPD, você possui o direito de solicitar, a qualquer momento, o acesso, a correção ou a exclusão definitiva dos seus dados de cadastro através dos nossos canais oficiais.
                </p>
              </section>

              <section class="contact-box">
                <h2 class="section-title">6. Contato e DPO</h2>
                <p>
                  Para exercer seus direitos ou sanar dúvidas sobre como tratamos seus dados, entre em contato com nosso Encarregado de Proteção de Dados (DPO):
                </p>
                <p class="dpo-email">📧 <strong>gestaoemdanca@gmail.com</strong></p>
              </section>
            </div>
          </div>

          <footer class="policy-card-footer">
            <button @click="voltar" class="btn-back">
              Voltar para o Sistema
            </button>
          </footer>
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

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const voltar = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/Ativacao');
  }
};
</script>

<style scoped>
/* ESTRUTURA PARA FORÇAR O RODAPÉ PARA BAIXO */
.policy-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #131129;
}

.main-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.policy-container {
  width: 100%;
  max-width: 850px;
}

.policy-card {
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* HEADER - MANTENDO SUAS CORES ORIGINAIS */
.policy-header {
  background-color: #1e3a8a;
  color: white;
  padding: 30px;
  text-align: center;
}

.policy-header h1 { font-size: 2rem; font-weight: 800; margin: 0; }
.subtitle { font-size: 1.1rem; margin-top: 8px; opacity: 0.85; }
.update-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.15);
  padding: 6px 16px;
  border-radius: 30px;
  font-size: 0.85rem;
  margin-top: 15px;
}

/* CONTEÚDO COM SCROLL CONTROLADO */
.policy-content {
  padding: 40px;
  color: #374151;
  line-height: 1.8;
  max-height: 400px; 
  overflow-y: auto;
  text-align: left;
}

.section-title {
  color: #1e3a8a;
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 12px;
}

.policy-list {
  list-style-type: disc;
  padding-left: 20px;
  margin-top: 10px;
}

.contact-box {
  background-color: #f8fafc;
  padding: 25px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  margin-top: 20px;
}

/* RODAPÉ DO CARD */
.policy-card-footer {
  padding: 20px;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: center;
}

.btn-back {
  background-color: #1e3a8a;
  color: white;
  padding: 14px 45px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-back:hover {
  background-color: #1e40af;
}

/* RODAPÉ GLOBAL (PADRÃO SISTEMA) */
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

/* RESPONSIVIDADE */
@media (max-width: 768px) {
  .main-wrapper { padding: 20px 10px; }
  .footer-content { flex-direction: column; gap: 10px; padding: 0 20px; }
  .footer-right { align-items: center; }
  .footer-spacer { display: none; }
  .policy-content { max-height: none; }
  .btn-back { width: 100%; }
}
</style>