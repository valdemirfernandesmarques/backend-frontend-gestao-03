<template>
  <div class="terms-page">
    <div class="main-wrapper">
      <div class="terms-container">
        <div class="terms-card">
          
          <header class="terms-header">
            <h1>Termos de Uso</h1>
            <p class="subtitle">Sistema Gestão em Dança</p>
            <div class="update-badge">
              Última atualização: 03 de setembro de 2025
            </div>
          </header>

          <div class="terms-content">
            <div class="space-y-6">
              <section>
                <p>
                  Bem-vindo ao <strong>Gestão em Dança</strong>! Estes Termos de Uso regem o acesso e a
                  utilização da nossa plataforma. A finalização do seu cadastro e o
                  uso do sistema estão condicionados à sua concordância com estes
                  termos.
                </p>
              </section>

              <section>
                <h2 class="section-title">1. Aceitação e Vinculação</h2>
                <p>
                  Ao preencher o formulário de ativação e marcar a caixa de seleção
                  "Li e aceito os Termos de Uso...", você confirma que leu,
                  compreendeu e concorda em se vincular legalmente a este acordo.
                </p>
              </section>

              <section>
                <h2 class="section-title">2. Descrição do Serviço</h2>
                <p>
                  O Gestão em Dança é uma plataforma desenvolvida como solução de
                  gestão para escolas de dança, especialmente útil para negócios
                  em fase inicial ou simulação de automação.
                </p>
              </section>

              <section>
                <h2 class="section-title">3. Cadastro e Período de Avaliação</h2>
                <p>
                  O usuário deve fornecer dados válidos (Nome Completo, CPF ou CNPJ
                  e e-mail). Após a ativação, terá direito a uma avaliação gratuita.
                </p>
              </section>

              <section>
                <h2 class="section-title">4. Modelo de Remuneração e Taxa de Serviço 0%</h2>
                <p>
                  Não, será cobrado nem um tipo de taxa para o uso do App;
                </p>
              </section>

              <section>
                <h2 class="section-title">5. Responsabilidade sobre os Dados</h2>
                <p>
                  O usuário é o único responsável pelos dados inseridos na
                  plataforma, garantindo base legal conforme a <strong>LGPD</strong>.
                </p>
              </section>

              <section>
                <h2 class="section-title">6. Propriedade Intelectual</h2>
                <p>
                  A plataforma é de propriedade exclusiva do Gestão em Dança,
                  concedendo licença de uso limitada e intransferível.
                </p>
              </section>

              <section>
                <h2 class="section-title">7. Lei Aplicável</h2>
                <p>
                  Estes termos são regidos pelas leis da República Federativa do Brasil.
                </p>
              </section>
            </div>
          </div>

          <footer class="terms-card-footer">
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
.terms-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #131129;
}

.main-wrapper {
  flex: 1; /* Ocupa todo o espaço disponível empurrando o footer */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.terms-container {
  width: 100%;
  max-width: 800px;
}

.terms-card {
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* HEADER - MANTENDO SUAS CORES ORIGINAIS */
.terms-header {
  background-color: #1d4ed8;
  color: white;
  padding: 30px;
  text-align: center;
}

.terms-header h1 { font-size: 2.2rem; font-weight: 800; margin: 0; }
.subtitle { font-size: 1.1rem; margin-top: 8px; opacity: 0.9; }
.update-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  padding: 6px 16px;
  border-radius: 30px;
  font-size: 0.85rem;
  margin-top: 15px;
}

/* CONTEÚDO COM SCROLL CONTROLADO */
.terms-content {
  padding: 40px;
  color: #374151;
  line-height: 1.7;
  max-height: 400px; /* Altura fixa para garantir que o rodapé apareça na tela */
  overflow-y: auto;
}

.section-title {
  color: #1e3a8a;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 10px;
  margin-top: 20px;
}

/* RODAPÉ DO CARD */
.terms-card-footer {
  padding: 20px;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: center;
}

.btn-back {
  background-color: #1d4ed8;
  color: white;
  padding: 14px 40px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
}

/* RODAPÉ GLOBAL (ESTILO ATIVAÇÃO/LOGIN) */
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
  .terms-content { max-height: none; } /* No mobile deixa crescer naturalmente */
}
</style>