<template>
  <div v-if="show" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <header class="modal-header">
        <h2><slot name="header">Título Padrão</slot></h2>
        <button class="close-btn" @click="closeModal">✖</button>
      </header>
      <main class="modal-body">
        <slot></slot>
      </main>
      <footer class="modal-footer" v-if="$slots.footer">
        <slot name="footer"></slot>
      </footer>
    </div>
  </div>
</template>

<script setup>
// Define as propriedades que o componente pode receber (do "pai")
defineProps({
  show: {
    type: Boolean,
    default: false
  }
});

// Define os eventos que o componente pode emitir (para o "pai")
const emit = defineEmits(['close']);

// Função que emite o evento 'close' quando o usuário quer fechar o modal
const closeModal = () => {
  emit('close');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: opacity 0.3s ease;
}

.modal-content {
  background-color: #2a2a3f; /* Cor de fundo consistente com o tema */
  color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px; /* Um pouco maior para formulários */
  box-shadow: 0px 4px MjIzNi0wMzA4LWYwMzctZDUyYWI5Yzc3YTU1X19zdGFydF9fMjIzNi0wMzA4LWYwMzctZDUyYWI5Yzc3YTU1X19lbmRfXzI1MjAtMDMwOC1mMzI0LTFmMWQ2NWI0YWQyOF9fc3RhcnRfXzI1MjAtMDMwOC1mMzI0LTFmMWQ2NWI0YWQyOF9fZW5kX18MjY4My0wMzA4LWQxODItODg4ZTA2NDJhMWJhX19zdGFydF9fMjY4My0wMzA4LWQxODItODg4ZTA2NDJhMWJhX19lbmRfXzMwMjMtMDMwOC1lNDY5LTFhZGM3YjI0Mjc0Nl9fc3RhcnRfXzMwMjMtMDMwOC1lNDY5LTFhZGM3YjI0Mjc0Nl9fZW5kX18zMzI3LTAzMDgtNGM2Ny1mMmM2YjljMWVhYmVfX3N0YXJ0X18zMzI3LTAzMDgtNGM2Ny1mMmM2YjljMWVhYmVfX2VuZF9fMzU4NS0wMzA4LTJhZDQtZWI4ZTk3YWUzMjM4X19zdGFydF9fMzU4NS0wMzA4LTJhZDQtZWI4ZTk3YWUzMjM4X19lbmRfXzM4OTktMDMwOC0zOGZlLWY1ZGU3MTA2MTI4Ml9fc3RhcnRfXzM4OTktMDMwOC0zOGZlLWY1ZGU3MTA2MTI4Ml9fZW5kX180MTgxLTAzMDgtNDU4My1jZTU5N2E2Zjc5NDNfX3N0YXJ0X180MTgxLTAzMDgtNDU4My1jZTU5N2E2Zjc5NDNfX2VuZF9f(0,0,0.5);
  transform: scale(0.95);
  transition: all 0.3s ease;
}

/* Animação de entrada */
.modal-overlay {
  animation: fadeIn 0.3s forwards;
}
.modal-content {
  animation: zoomIn 0.3s forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes zoomIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: #1f1c3a;
  border-bottom: 1px solid #3e3e5b;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
}

.modal-body {
  padding: 1.5rem;
  max-height: 70vh; /* Para modais com muito conteúdo */
  overflow-y: auto;
}

.modal-footer {
  padding: 1rem 1.5rem;
  text-align: right;
  border-top: 1px solid #3e3e5b;
  background-color: #1f1c3a;
}

.close-btn {
  background: none;
  border: none;
  color: #ccc;
  font-size: 24px;
  cursor: pointer;
  transition: transform 0.2s, color 0.2s;
}

.close-btn:hover {
  transform: scale(1.2);
  color: #ff3c78;
}
</style>