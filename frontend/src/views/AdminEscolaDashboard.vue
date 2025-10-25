<template>
  <div>
    <section class="quick-access">
      <h3>Acesso Rápido</h3>
      <div class="cards-container">
        <div class="card" @click="goToNewMatricula">
          <i class="fas fa-user-plus"></i>
          <span>Nova Matrícula</span>
        </div>
        <div class="card" @click="goTo('pagamentos')">
          <i class="fas fa-money-bill-wave"></i>
          <span>Registrar Pagamento</span>
        </div>
        <div class="card" @click="goTo('turmas')">
          <i class="fas fa-calendar-check"></i>
          <span>Agenda de Hoje</span>
        </div>
      </div>
    </section>

    <section class="main-view">
      <h3>Visão Geral das Turmas</h3>
      <div class="content-placeholder">
        <p>O conteúdo principal de cada módulo, como a lista de alunos ou o calendário de turmas, aparecerá aqui.</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

// Função para navegar para outras seções
const goTo = (module) => {
  router.push(`/escola/${module}`);
};

// Função específica para o botão "Nova Matrícula"
const goToNewMatricula = () => {
  // Navega para a página de matrículas e passa um parâmetro na URL
  // para instruir a página a abrir o modal de cadastro.
  router.push({ path: '/escola/matriculas', query: { action: 'new' } });
};
</script>

<style scoped>
/* Estilos que eram do layout e pertencem ao dashboard estão agora aqui */
.quick-access {
  margin-bottom: 2rem;
}
.cards-container {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}
.card {
  background-color: #3a3a55;
  flex: 1;
  min-width: 150px;
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}
.card i {
  font-size: 24px;
  margin-bottom: 0.5rem;
  display: block;
  color: #ff3c78;
}
.card span {
  color: #fff;
  font-weight: 500;
}
.card:hover {
  background-color: #ff3c78;
}
.main-view {
  background-color: #2a2a3f;
  padding: 1.5rem;
  border-radius: 12px;
}
.content-placeholder {
  color: #ccc;
}
</style>