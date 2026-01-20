<template>
  <div class="turma-page">
    <h1><i class="fas fa-calendar-alt"></i> Gerenciar Turmas e Agenda</h1>

    <div class="top-actions">
      <button @click="openModal()">
        <i class="bi bi-plus-circle"></i> Adicionar Turma
      </button>
    </div>

    <p v-if="loading">Carregando turmas...</p>
    <Table 
      v-else 
      :data="turmas" 
      :columns="columns"
      :actions="['edit', 'delete']"
      @edit="openModal" 
      @delete="deleteTurma" 
    />

    <Modal :show="isModalOpen" @close="closeModal">
      <template #header></template>
      
      <div class="form-container">
        <h2>
          <i class="bi bi-calendar-plus"></i>
          {{ editMode ? 'Editar Turma' : 'Nova Turma' }}
        </h2>

        <form @submit.prevent="submitForm">
          <div class="form-grid">
            <div>
              <label for="nome">Nome da Turma</label>
              <input type="text" id="nome" v-model="form.nome" placeholder="Ex: Ballet Infantil - Manhã" required>
            </div>
            <div>
              <label for="maxAlunos">Máximo de Alunos</label>
              <input type="number" id="maxAlunos" v-model="form.maxAlunos" placeholder="Ex: 15" required>
            </div>
            <div>
              <label for="modalidade">Modalidade</label>
              <select id="modalidade" v-model="form.modalidadeId" required>
                <option value="" disabled>Selecione a modalidade</option>
                <option v-for="mod in modalidades" :key="mod.id" :value="mod.id">
                  {{ mod.nome }}
                </option>
              </select>
            </div>
            <div>
              <label for="professor">Professor</label>
              <select id="professor" v-model="form.professorId" required>
                <option value="" disabled>Selecione o professor</option>
                <option v-for="prof in professores" :key="prof.id" :value="prof.id">
                  {{ prof.nome }}
                </option>
              </select>
            </div>

            <div class="full-width-field">
              <label for="valorMensalidade">Valor da Mensalidade (R$)</label>
              <input type="number" id="valorMensalidade" v-model="form.valorMensalidade" placeholder="Ex: 200.00" step="0.01" required>
            </div>

            <div class="full-width-field">
              <label>Dias da Semana</label>
              <div class="dias-semana-group">
                <label v-for="dia in diasDaSemana" :key="dia.value">
                  <input type="checkbox" :value="dia.value" v-model="form.diasDaSemana">
                  {{ dia.text }}
                </label>
              </div>
            </div>
            <div class="form-grid">
              <div>
                <label for="horarioInicio">Horário de Início</label>
                <input type="time" id="horarioInicio" v-model="form.horarioInicio" required>
              </div>
              <div>
                <label for="horarioFim">Horário de Fim</label>
                <input type="time" id="horarioFim" v-model="form.horarioFim" required>
              </div>
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

const turmas = ref([]);
const modalidades = ref([]);
const professores = ref([]);
const loading = ref(true);
const columns = ref([
  { label: 'Nome', field: 'nome' },
  { label: 'Modalidade', field: 'ModalidadeNome' },
  { label: 'Professor', field: 'ProfessorNome' },
  { label: 'Valor', field: 'valorMensalidade' },
  { label: 'Horários', field: 'horarios' }
]);
const isModalOpen = ref(false);
const editMode = ref(false);
const form = ref({
  id: null, nome: '', modalidadeId: '', professorId: '',
  horarioInicio: '', horarioFim: '', diasDaSemana: [], maxAlunos: 10, valorMensalidade: 0.00
});

const diasDaSemana = [
  { text: 'Seg', value: 'Segunda-feira' }, { text: 'Ter', value: 'Terça-feira' },
  { text: 'Qua', value: 'Quarta-feira' }, { text: 'Qui', value: 'Quinta-feira' },
  { text: 'Sex', value: 'Sexta-feira' }, { text: 'Sáb', value: 'Sábado' },
  { text: 'Dom', value: 'Domingo' }
];

const loadData = async () => {
  loading.value = true;
  try {
    const [resTurmas, resModalidades, resProfessores] = await Promise.all([
      api.get('/turmas'),
      api.get('/modalidades'),
      api.get('/professores')
    ]);
    modalidades.value = resModalidades.data || [];
    professores.value = resProfessores.data || [];
    turmas.value = (resTurmas.data || []).map(turma => ({
      ...turma,
      ModalidadeNome: modalidades.value.find(m => m.id === turma.modalidadeId)?.nome || 'N/A',
      ProfessorNome: professores.value.find(p => p.id === turma.professorId)?.nome || 'N/A',
      horarios: `${turma.diaDaSemana || ''} das ${turma.horarioInicio || ''} às ${turma.horarioFim || ''}`
    }));
  } catch (err) {
    console.error('Erro ao carregar dados:', err);
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  form.value = { 
    id: null, nome: '', modalidadeId: '', professorId: '', horarioInicio: '', 
    horarioFim: '', diasDaSemana: [], maxAlunos: 10, valorMensalidade: 0.00 
  };
};

const openModal = (turmaToEdit = null) => {
  resetForm();
  if (turmaToEdit && turmaToEdit.id) {
    editMode.value = true;
    form.value = { ...turmaToEdit, diasDaSemana: (turmaToEdit.diaDaSemana || '').split(', ') };
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
    const payload = { ...form.value, diaDaSemana: form.value.diasDaSemana.join(', ') };
    if (editMode.value) {
      await api.put(`/turmas/${payload.id}`, payload);
    } else {
      await api.post('/turmas', payload);
    }
    await loadData();
    closeModal();
  } catch (err) {
    console.error('Erro ao salvar turma:', err);
    alert('Erro ao salvar turma.');
  }
};

const deleteTurma = async (turma) => {
  if (!confirm(`Deseja realmente excluir a turma ${turma.nome}?`)) return;
  try {
    await api.delete(`/turmas/${turma.id}`);
    await loadData();
  } catch (err) {
    console.error('Erro ao deletar turma:', err);
    alert('Erro ao deletar turma.');
  }
};

onMounted(loadData);
</script>

<style scoped>
/* Estilos da página e formulário seguindo o padrão profissional */
.turma-page { background-color: #1f1c3a; padding: 2rem; border-radius: 12px; min-height: 100vh; }
.turma-page h1 { color: #f0f0f0; margin-bottom: 1.5rem; font-weight: 600; display: flex; align-items: center; gap: 10px; font-size: clamp(1.2rem, 4vw, 1.8rem); }
.top-actions { display: flex; justify-content: flex-end; margin-bottom: 1.5rem; }
.top-actions button { padding: 0.8rem 1.5rem; background-color: #e45da9; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem; font-weight: 600; transition: all 0.2s ease; display: flex; align-items: center; gap: 8px; }
.top-actions button:hover { background-color: #ff7eb3; transform: translateY(-2px); }

.form-container { padding: 10px; width: 100%; max-width: 100%; }
.form-container h2 { text-align: center; color: #e45da9; font-weight: 600; margin-bottom: 2rem; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 1.3rem; }

/* Grid responsivo: 2 colunas no desktop, 1 coluna no mobile */
.form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
.full-width-field { grid-column: 1 / -1; }

label { font-weight: 600; color: #c799df; margin-bottom: 8px; display: block; font-size: 0.9rem; }
input, select { width: 100%; padding: 12px; border-radius: 10px; border: 1px solid #3e3e5b; background-color: #181529; color: #f0f0f0; outline: none; font-size: 1rem; font-family: 'Poppins', sans-serif; transition: all 0.3s ease; }
input:focus, select:focus { border-color: #e45da9; box-shadow: 0 0 8px rgba(228, 93, 169, 0.3); }

.dias-semana-group { display: flex; gap: 10px; flex-wrap: wrap; background-color: #181529; padding: 15px; border-radius: 10px; border: 1px solid #3e3e5b; }
.dias-semana-group label { display: flex; align-items: center; gap: 8px; color: #f0f0f0; cursor: pointer; font-weight: 400; margin-bottom: 0; }
.dias-semana-group input[type="checkbox"] { width: auto; accent-color: #e45da9; }

.button-group { display: flex; justify-content: flex-end; gap: 15px; margin-top: 2.5rem; border-top: 1px solid #3e3e5b; padding-top: 1.5rem; }
.button-group button { flex-grow: 0; padding: 12px 30px; border: none; border-radius: 10px; color: white; font-weight: 600; cursor: pointer; font-size: 1rem; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 8px; }
.btn-principal { background-color: #e45da9; }
.btn-secundario { background-color: #3e3e5b; }
.button-group button:hover { opacity: 0.9; transform: translateY(-2px); }

/* REGRAS DE RESPONSIVIDADE (TABLET E CELULAR) */
@media (max-width: 768px) {
  .turma-page { padding: 1rem; }
  .top-actions { justify-content: center; }
  .top-actions button { width: 100%; justify-content: center; }
  
  .form-grid { grid-template-columns: 1fr; } /* Força 1 coluna no mobile */
  
  .button-group { flex-direction: column; } /* Botões um em cima do outro */
  .button-group button { width: 100%; }
  
  .dias-semana-group { justify-content: space-between; }
}

@media (max-width: 480px) {
  .dias-semana-group label { width: 45%; } /* Dias da semana em 2 colunas no celular pequeno */
}
</style>