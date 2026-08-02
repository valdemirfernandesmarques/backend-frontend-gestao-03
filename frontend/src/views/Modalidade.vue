<template>
  <div class="modalidade-page">
    <h1><i class="fas fa-palette"></i> Gerenciar Modalidades</h1>

    <div class="top-actions">
      <button @click="openModal()">
        <i class="bi bi-plus-circle"></i> Adicionar Modalidade
      </button>
    </div>

    <p v-if="loading">Carregando modalidades...</p>
    <Table 
      v-else 
      :data="modalidades" 
      :columns="columns"
      :actions="['edit', 'delete']"
      @edit="openModal" 
      @delete="deleteModalidade" 
    />

    <Modal :show="isModalOpen" @close="closeModal">
      <template #header>
        <h2>{{ editMode ? 'Editar Modalidade' : 'Nova Modalidade' }}</h2>
      </template>
      
      <form @submit.prevent="submitForm" class="form-container">
        <div class="form-grid">
          <div>
            <label for="nome">Nome da Modalidade</label>
            <input type="text" id="nome" v-model="form.nome" placeholder="Ex: Ballet Clássico" required>
          </div>
          <div>
            <label for="precoAula">Preço Base da Aula (R$)</label>
            <input type="number" id="precoAula" v-model="form.precoAula" placeholder="Ex: 85.00" step="0.01" required>
          </div>
          <div class="full-width-field">
            <label for="descricao">Descrição (Opcional)</label>
            <textarea id="descricao" v-model="form.descricao" rows="4" placeholder="Detalhes sobre a modalidade, nível, etc."></textarea>
          </div>
        </div>

        <div class="button-group">
          <button type="button" class="btn-secundario" @click="closeModal">
             Cancelar
          </button>
          <button type="submit" class="btn-principal">
            <i :class="editMode ? 'bi bi-arrow-repeat' : 'bi bi-plus-circle'"></i> 
            {{ editMode ? 'Atualizar' : 'Salvar' }}
          </button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Table from '../components/Table.vue';
import Modal from '../components/Modal.vue';
import api from '../api/api.js';

const modalidades = ref([]);
const loading = ref(true);
const columns = ref([
  { label: 'Nome', field: 'nome' },
  { label: 'Descrição', field: 'descricao' },
  { label: 'Preço da Aula', field: 'precoAula' }
]);
const isModalOpen = ref(false);
const editMode = ref(false);
const form = ref({
  id: null,
  nome: '',
  descricao: '',
  precoAula: 0.00
});

const loadData = async () => {
  loading.value = true;
  try {
    const response = await api.get('/modalidades');
    modalidades.value = response.data || [];
  } catch (err) {
    console.error('Erro ao carregar modalidades:', err);
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  form.value = { id: null, nome: '', descricao: '', precoAula: 0.00 };
};

const openModal = (modalidadeToEdit = null) => {
  resetForm();
  if (modalidadeToEdit && modalidadeToEdit.id) {
    editMode.value = true;
    form.value = { ...modalidadeToEdit };
  } else {
    editMode.value = false;
  }
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const submitForm = async () => {
  try {
    const escolaId = localStorage.getItem('escolaId');
    if (!escolaId) {
      alert('Erro: Identificação da escola não encontrada. Por favor, faça o login novamente.');
      return;
    }

    const payload = { ...form.value, escolaId: parseInt(escolaId) };

    if (editMode.value) {
      await api.put(`/modalidades/${payload.id}`, payload);
    } else {
      await api.post('/modalidades', payload);
    }
    await loadData();
    closeModal();
  } catch (err) {
    console.error('Erro ao salvar modalidade:', err);
    const errorMessage = err.response?.data?.error || 'Erro ao salvar modalidade.';
    alert(errorMessage);
  }
};

const deleteModalidade = async (modalidade) => {
  if (!confirm(`Deseja realmente excluir a modalidade ${modalidade.nome}?`)) return;
  try {
    await api.delete(`/modalidades/${modalidade.id}`);
    await loadData();
  } catch (err) {
    console.error('Erro ao deletar modalidade:', err);
    alert('Erro ao deletar modalidade.');
  }
};

onMounted(loadData);
</script>

<style scoped>
/* ===== Layout Base ===== */
.modalidade-page {
  background-color: #1f1c3a;
  padding: 2rem;
  border-radius: 12px;
}

.modalidade-page h1 {
  color: #f0f0f0;
  margin-bottom: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.top-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}

.top-actions button {
  padding: 0.8rem 1.5rem;
  background-color: #e45da9;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.top-actions button:hover {
  background-color: #ff7eb3;
  transform: translateY(-2px);
}

/* ===== Formulário ===== */
.form-container {
  padding: 10px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.full-width-field {
  grid-column: 1 / -1;
}

label {
  font-weight: 600;
  color: #c799df;
  margin-bottom: 8px;
  display: block;
  font-size: 0.9rem;
}

input,
textarea {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #3e3e5b;
  background-color: #181529;
  color: #f0f0f0;
  outline: none;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
  transition: all 0.3s ease;
}

input:focus,
textarea:focus {
  border-color: #e45da9;
  box-shadow: 0 0 8px rgba(228, 93, 169, 0.3);
}

/* ===== Botões ===== */
.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 2.5rem;
  border-top: 1px solid #3e3e5b;
  padding-top: 1.5rem;
  flex-wrap: wrap;
}

.button-group button {
  padding: 12px 30px;
  border: none;
  border-radius: 10px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-principal {
  background-color: #e45da9;
}

.btn-secundario {
  background-color: #3e3e5b;
}

.button-group button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

/* ===== Tablet ===== */
@media (max-width: 1024px) {
  .modalidade-page {
    padding: 1.5rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .top-actions {
    justify-content: center;
  }
}

/* ===== Celular ===== */
@media (max-width: 600px) {
  .modalidade-page {
    padding: 1rem;
  }

  .modalidade-page h1 {
    font-size: 1.2rem;
    justify-content: center;
    text-align: center;
  }

  .top-actions button {
    width: 100%;
    justify-content: center;
  }

  .button-group {
    flex-direction: column;
    align-items: stretch;
  }

  .button-group button {
    width: 100%;
  }
}
</style>
