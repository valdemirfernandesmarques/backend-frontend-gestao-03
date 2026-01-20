<template>
  <div class="terms-page">
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
                e e-mail). Após a ativação, terá direito a <strong>6 dias corridos</strong> de
                avaliação gratuita.
              </p>
            </section>

            <section>
              <h2 class="section-title">4. Modelo de Remuneração e Taxa de Serviço</h2>
              <p>
                A partir do 7º dia, será aplicada automaticamente uma taxa de
                <strong>1,3%</strong> sobre o valor bruto das transações processadas pelo sistema,
                via gateway integrado.
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

        <footer class="terms-footer">
          <button @click="voltar" class="btn-back">
            <i class="fas fa-arrow-left"></i> Voltar para o Sistema
          </button>
        </footer>

      </div>
      <p class="copyright-text">© 2026 Gestão em Dança - Todos os direitos reservados</p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const voltar = () => {
  // Se houver histórico, volta. Se não, vai para a ativação.
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/Ativacao');
  }
};
</script>

<style scoped>
/* FUNDO E ESTRUTURA */
.terms-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #131129; /* Fundo escuro do sistema */
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

/* HEADER */
.terms-header {
  background-color: #1d4ed8; /* Azul forte profissional */
  color: white;
  padding: 40px 30px;
  text-align: center;
}

.terms-header h1 {
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0;
}

.subtitle {
  font-size: 1.1rem;
  margin-top: 8px;
  opacity: 0.9;
}

.update-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  padding: 6px 16px;
  border-radius: 30px;
  font-size: 0.85rem;
  margin-top: 20px;
}

/* TEXTO */
.terms-content {
  padding: 40px;
  color: #374151;
  line-height: 1.7;
  max-height: 50vh; /* Scroll interno para desktop */
  overflow-y: auto;
}

.section-title {
  color: #1e3a8a;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 10px;
  margin-top: 20px;
}

/* RODAPÉ E BOTÃO */
.terms-footer {
  padding: 30px;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: center;
}

.btn-back {
  background-color: #1d4ed8;
  color: white;
  padding: 16px 40px;
  border-radius: 14px;
  font-size: 1.1rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-back:hover {
  background-color: #1e40af;
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(29, 78, 216, 0.3);
}

.copyright-text {
  text-align: center;
  color: #6b7280;
  margin-top: 20px;
  font-size: 0.9rem;
}

/* RESPONSIVIDADE */
@media (max-width: 768px) {
  .terms-page { padding: 20px 10px; }
  .terms-header { padding: 30px 20px; }
  .terms-header h1 { font-size: 1.6rem; }
  .terms-content { padding: 25px; max-height: none; } /* Remove scroll interno no mobile */
  .btn-back { width: 100%; justify-content: center; }
}
</style>