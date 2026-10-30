<template>
  <div class="policy-page">
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

        <footer class="policy-footer">
          <button @click="voltar" class="btn-back">
            <i class="fas fa-arrow-left"></i> Voltar para o Sistema
          </button>
        </footer>

      </div>
      <p class="copyright-text">© 2026 Gestão em Dança - Proteção e Transparência</p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const voltar = () => {
  // Retorna para a tela anterior ou para a ativação caso não haja histórico
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/Ativacao');
  }
};
</script>

<style scoped>
/* FUNDO E ESTRUTURA GLOBAL */
.policy-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #131129; /* Fundo padrão do sistema */
  padding: 40px 20px;
}

.policy-container {
  width: 100%;
  max-width: 850px; /* Largura levemente maior para facilitar leitura de listas */
}

.policy-card {
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* HEADER */
.policy-header {
  background-color: #1e3a8a; /* Azul marinho sóbrio */
  color: white;
  padding: 40px 30px;
  text-align: center;
}

.policy-header h1 {
  font-size: 2rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.02em;
}

.subtitle {
  font-size: 1.1rem;
  margin-top: 8px;
  opacity: 0.85;
}

.update-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.15);
  padding: 6px 16px;
  border-radius: 30px;
  font-size: 0.85rem;
  margin-top: 20px;
}

/* CONTEÚDO */
.policy-content {
  padding: 40px;
  color: #374151;
  line-height: 1.8;
  max-height: 60vh;
  overflow-y: auto;
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

.policy-list li {
  margin-bottom: 8px;
}

.contact-box {
  background-color: #f8fafc;
  padding: 25px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
}

.dpo-email {
  font-size: 1.1rem;
  color: #2563eb;
  margin-top: 10px;
}

/* RODAPÉ E BOTÃO */
.policy-footer {
  padding: 30px;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: center;
}

.btn-back {
  background-color: #1e3a8a;
  color: white;
  padding: 16px 45px;
  border-radius: 14px;
  font-size: 1.1rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-back:hover {
  background-color: #1e40af;
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(30, 58, 138, 0.3);
}

.copyright-text {
  text-align: center;
  color: #6b7280;
  margin-top: 25px;
  font-size: 0.9rem;
}

/* RESPONSIVIDADE */
@media (max-width: 768px) {
  .policy-page { padding: 20px 10px; }
  .policy-header h1 { font-size: 1.6rem; }
  .policy-content { padding: 25px; max-height: none; }
  .btn-back { width: 100%; justify-content: center; }
  .contact-box { padding: 15px; }
}
</style>