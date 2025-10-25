<template>
  <div class="matricula-page">
    <h1><i class="fas fa-user-plus"></i> Gerenciar Matrículas</h1>

    <div class="top-actions">
      <button @click="openModal()">
        <i class="bi bi-plus-circle"></i> Adicionar Matrícula
      </button>
    </div>

    <p v-if="loading">Carregando matrículas...</p>
    <Table 
      v-else 
      :data="matriculas" 
      :columns="columns"
      :actions="['edit', 'delete']"
      @edit="openModal" 
      @delete="deleteMatricula" 
    />

    <Modal :show="isModalOpen" @close="closeModal">
      <template #header></template>
      
      <div class="form-container">
        <h2>
          <i class="bi bi-file-earmark-text"></i>
          {{ editMode ? 'Editar Matrícula' : 'Nova Matrícula' }}
        </h2>

        <form @submit.prevent="submitForm">
          <div class="form-grid">
            <div>
              <label for="aluno">Aluno</label>
              <select id="aluno" v-model="form.alunoId" required>
                <option value="" disabled>Selecione um aluno...</option>
                <option v-for="aluno in alunos" :key="aluno.id" :value="aluno.id">{{ aluno.nome }}</option>
              </select>
            </div>
            <div>
              <label for="turma">Turma</label>
              <select id="turma" v-model="form.turmaId" required>
                <option value="" disabled>Selecione uma turma...</option>
                <option v-for="turma in turmas" :key="turma.id" :value="turma.id">{{ turma.nome }}</option>
              </select>
            </div>
            <div class="full-width-field">
              <label for="dataMatricula">Data da Matrícula</label>
              <input type="date" id="dataMatricula" v-model="form.dataMatricula" required />
            </div>
          </div>

          <div class="button-group">
            <button type="button" class="btn-secundario" @click="closeModal">Cancelar</button>
            <button type="submit" class="btn-principal">
              <i :class="editMode ? 'bi bi-arrow-repeat' : 'bi bi-plus-circle'"></i> 
              {{ editMode ? 'Atualizar' : 'Salvar' }}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Table from '../components/Table.vue';
import Modal from '../components/Modal.vue';
import api from '../api/api.js';
import { useRoute } from 'vue-router';

const matriculas = ref([]);
const alunos = ref([]);
const turmas = ref([]);
const loading = ref(true);
const columns = ref([
  { label: 'Aluno', field: 'AlunoNome' },
  { label: 'Turma', field: 'TurmaNome' },
  // AJUSTE: A tabela agora exibirá a data formatada
  { label: 'Data de Matrícula', field: 'dataMatriculaFormatada' }
]);
const isModalOpen = ref(false);
const editMode = ref(false);
const form = ref({
  id: null,
  alunoId: '',
  turmaId: '',
  dataMatricula: ''
});
const route = useRoute();

const loadData = async () => {
  loading.value = true;
  try {
    const [resMatriculas, resAlunos, resTurmas] = await Promise.all([
      api.get('/matriculas'),
      api.get('/alunos'),
      api.get('/turmas')
    ]);
    alunos.value = resAlunos.data || [];
    turmas.value = resTurmas.data || [];
    matriculas.value = (resMatriculas.data || []).map(m => ({
      ...m, // Mantém todos os dados originais da matrícula (incluindo a data original)
      AlunoNome: alunos.value.find(a => a.id === m.alunoId)?.nome || 'N/A',
      TurmaNome: turmas.value.find(t => t.id === m.turmaId)?.nome || 'N/A',
      // AJUSTE: Cria um campo separado apenas para a exibição da data na tabela
      dataMatriculaFormatada: new Date(m.dataMatricula).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
    }));
  } catch (err) {
    console.error('Erro ao carregar dados:', err);
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  form.value = { id: null, alunoId: '', turmaId: '', dataMatricula: '' };
};

const openModal = (matriculaToEdit = null) => {
  resetForm();
  if (matriculaToEdit && matriculaToEdit.id) {
    editMode.value = true;
    // Agora 'matriculaToEdit.dataMatricula' tem o formato original, que o input 'date' entende
    form.value = { 
      ...matriculaToEdit,
      dataMatricula: matriculaToEdit.dataMatricula ? new Date(matriculaToEdit.dataMatricula).toISOString().split('T')[0] : ''
    };
  } else {
    editMode.value = false;
    form.value.dataMatricula = new Date().toISOString().split('T')[0];
  }
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const submitForm = async () => {
  try {
    const payload = { ...form.value };
    if (editMode.value) {
      await api.put(`/matriculas/${payload.id}`, payload);
    } else {
      await api.post('/matriculas', payload);
    }
    await loadData();
    closeModal();
  } catch (err) {
    console.error('Erro ao salvar matrícula:', err);
    alert('Erro ao salvar matrícula.');
  }
};

const deleteMatricula = async (matricula) => {
  if (!confirm(`Deseja realmente excluir a matrícula do aluno?`)) return;
  try {
    await api.delete(`/matriculas/${matricula.id}`);
    await loadData();
  } catch (err) {
    console.error('Erro ao deletar matrícula:', err);
    alert('Erro ao deletar matrícula.');
  }
};

onMounted(() => {
  loadData();
  if (route.query.action === 'new') {
    openModal();
  }
});
</script>

<style scoped>
/* Estilos da página e formulário */
.matricula-page { background-color: #1f1c3a; padding: 2rem; border-radius: 12px; }
.matricula-page h1 { color: #f0f0f0; margin-bottom: 1.5rem; font-weight: 600; display: flex; align-items: center; gap: 10px; }
.top-actions { display: flex; justify-content: flex-end; margin-bottom: 1.5rem; }
.top-actions button { padding: 0.8rem 1.5rem; background-color: #e45da9; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem; font-weight: 600; transition: all 0.2s ease; display: flex; align-items: center; gap: 8px; }
.top-actions button:hover { background-color: #ff7eb3; transform: translateY(-2px); }
.form-container { padding: 10px; }
.form-container h2 { text-align: center; color: #e45da9; font-weight: 600; margin-bottom: 2rem; display: flex; align-items: center; justify-content: center; gap: 10px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.full-width-field { grid-column: 1 / -1; }
label { font-weight: 600; color: #c79df; margin-bottom: 8px; display: block; font-size: 0.9rem; }
input, select { width: 100%; padding: 12px; border-radius: 10px; border: 1px solid #3e3e5b; background-color: #181529; color: #f0f0f0; outline: none; font-size: 1rem; font-family: 'Poppins', sans-serif; transition: all 0.3s ease; }
input:focus, select:focus { border-color: #e45da9; box-shadow: 0 0 8px rgba(228, 93, 169, 0.3); }
.button-group { display: flex; justify-content: flex-end; gap: 15px; margin-top: 2.5rem; border-top: 1px solid #3e3e5b; padding-top: 1.5rem; }
.button-group button { flex-grow: 0; padding: 12px 30px; border: none; border-radius: 10px; color: white; font-weight: 600; cursor: pointer; font-size: 1rem; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 8px; }
.btn-principal { background-color: #e45da9; }
.btn-secundario { background-color: #3e3e5b; }
.button-group button:hover { opacity: 0.9; transform: translateY(-2px); }
</style>