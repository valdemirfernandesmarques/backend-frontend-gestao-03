<template>
  <div class="professor-page">
    <h1><i class="fas fa-chalkboard-teacher"></i> Gerenciar Professores</h1>

    <div class="top-actions">
      <button @click="openModal()">
        <i class="bi bi-plus-circle"></i> Adicionar Professor
      </button>
    </div>

    <p v-if="loading">Carregando professores...</p>
    <Table 
      v-else 
      :data="professores" 
      :columns="columns"
      :actions="['edit', 'delete']"
      @edit="openModal" 
      @delete="deleteProfessor" 
    />

    <Modal :show="isModalOpen" @close="closeModal">
      <template #header></template>
      
      <div class="form-container">
        <h2>
          <i class="bi bi-person-video3"></i> 
          {{ editMode ? 'Editar Professor' : 'Cadastro de Professor' }}
        </h2>

        <form @submit.prevent="submitForm">
          <div class="form-grid">
            <div>
              <label for="nome">Nome Completo</label>
              <input type="text" id="nome" v-model="form.nome" required>
            </div>
            
            <div>
              <label for="genero">Gênero</label>
              <select id="genero" v-model="form.genero" required>
                  <option value="" disabled>Selecione...</option>
                  <option>Feminino</option>
                  <option>Masculino</option>
                  <option>Outro</option>
              </select>
            </div>

            <div>
              <label for="telefone">Telefone</label>
              <input type="tel" id="telefone" v-model="form.telefone" placeholder="(xx) xxxxx-xxxx" required>
            </div>

            <div>
              <label for="email">E-mail</label>
              <input type="email" id="email" v-model="form.email" placeholder="professor@email.com" required>
            </div>
            
            <div>
              <label for="cpf">CPF</label>
              <input type="text" id="cpf" v-model="form.cpf" placeholder="000.000.000-00" required>
            </div>

            <div>
              <label for="contrato">Tipo de Contrato</label>
              <select id="contrato" v-model="form.vinculo" required>
                  <option value="" disabled>Selecione...</option>
                  <option>CLT</option>
                  <option>Autônomo</option>
                  <option>Comissão</option>
              </select>
            </div>

            <div class="full-width-field">
              <label for="modalidades">Modalidades (segure Ctrl/Cmd para selecionar várias)</label>
              <select id="modalidades" v-model="form.modalidadeIds" multiple required>
                <option v-for="modalidade in modalidadesDisponiveis" :key="modalidade.id" :value="modalidade.id">
                  {{ modalidade.nome }}
                </option>
              </select>
            </div>

            <div class="full-width-field">
              <label for="observacao">Observações / Disponibilidade</label>
              <input type="text" id="observacao" v-model="form.observacao" placeholder="Ex: Aulas infantis, substituto, etc...">
            </div>
          </div>

          <div class="button-group">
            <button type="button" class="btn-secundario" @click="closeModal">
               Cancelar
            </button>
            <button type="submit" class="btn-principal">
              <i :class="editMode ? 'bi bi-arrow-repeat' : 'bi bi-plus-circle'"></i> 
              {{ editMode ? 'Atualizar' : 'Cadastrar' }}
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

const professores = ref([]);
const modalidadesDisponiveis = ref([]);
const loading = ref(true);
const columns = ref([
  { label: 'Nome', field: 'nome' },
  { label: 'Telefone', field: 'telefone' },
  { label: 'Email', field: 'email' },
  { label: 'Vínculo', field: 'vinculo' }
]);
const isModalOpen = ref(false);
const editMode = ref(false);
const form = ref({
  id: null, nome: '', genero: '', telefone: '', cpf: '', email: '',
  endereco: '', vinculo: '', modalidadeIds: [], observacao: ''
});

const loadData = async () => {
  loading.value = true;
  try {
    const [resProfessores, resModalidades] = await Promise.all([
      api.get('/professores'),
      api.get('/modalidades')
    ]);
    professores.value = resProfessores.data || [];
    modalidadesDisponiveis.value = resModalidades.data || [];
  } catch (err) {
    console.error('Erro ao carregar dados:', err);
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  form.value = {
    id: null, nome: '', genero: '', telefone: '', cpf: '', email: '',
    endereco: '', vinculo: '', modalidadeIds: [], observacao: ''
  };
};

const openModal = (professorToEdit = null) => {
  resetForm();
  if (professorToEdit && professorToEdit.id) {
    editMode.value = true;
    form.value = { 
        ...professorToEdit,
        modalidadeIds: professorToEdit.modalidades ? professorToEdit.modalidades.map(m => m.id) : []
    };
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
    const payload = { ...form.value };
    if (editMode.value) {
      await api.put(`/professores/${payload.id}`, payload);
    } else {
      await api.post('/professores', payload);
    }
    await loadData();
    closeModal();
  } catch (err) {
    console.error('Erro ao salvar professor:', err);
    alert('Erro ao salvar professor.');
  }
};

const deleteProfessor = async (professor) => {
  if (!confirm(`Deseja realmente excluir o professor ${professor.nome}?`)) return;
  try {
    await api.delete(`/professores/${professor.id}`);
    await loadData();
  } catch (err) {
    console.error('Erro ao deletar professor:', err);
    alert('Erro ao deletar professor.');
  }
};

onMounted(loadData);
</script>

<style scoped>
.professor-page {
  background-color: #1f1c3a;
  padding: 2rem;
  border-radius: 12px;
  min-height: 100vh;
}
.professor-page h1 { color: #f0f0f0; margin-bottom: 1.5rem; font-weight: 600; display: flex; align-items: center; gap: 10px; font-size: clamp(1.2rem, 4vw, 1.8rem); }
.top-actions { display: flex; justify-content: flex-end; margin-bottom: 1.5rem; }
.top-actions button { padding: 0.8rem 1.5rem; background-color: #e45da9; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem; font-weight: 600; transition: all 0.2s ease; display: flex; align-items: center; gap: 8px; }
.top-actions button:hover { background-color: #ff7eb3; transform: translateY(-2px); }

.form-container { padding: 10px; width: 100%; }
.form-container h2 { text-align: center; color: #e45da9; font-weight: 600; margin-bottom: 2rem; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 1.3rem; }

/* Grid principal configurado para 2 colunas */
.form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
.full-width-field { grid-column: 1 / -1; }

label { font-weight: 600; color: #c799df; margin-bottom: 8px; display: block; font-size: 0.9rem; }
input, select { width: 100%; padding: 12px; border-radius: 10px; border: 1px solid #3e3e5b; background-color: #181529; color: #f0f0f0; outline: none; font-size: 1rem; transition: all 0.3s ease; }
select[multiple] { height: 120px; padding: 10px; }
input:focus, select:focus { border-color: #e45da9; box-shadow: 0 0 8px rgba(228, 93, 169, 0.3); }

.button-group { display: flex; justify-content: flex-end; gap: 15px; margin-top: 2.5rem; border-top: 1px solid #3e3e5b; padding-top: 1.5rem; }
.button-group button { padding: 12px 30px; border: none; border-radius: 10px; color: white; font-weight: 600; cursor: pointer; font-size: 1rem; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 8px; }
.btn-principal { background-color: #e45da9; }
.btn-secundario { background-color: #3e3e5b; }

/* REGRAS DE RESPONSIVIDADE ADICIONADAS APENAS NO CSS */
@media (max-width: 768px) {
  .professor-page { padding: 1rem; }
  .top-actions { justify-content: center; }
  .top-actions button { width: 100%; justify-content: center; }
  .form-grid { grid-template-columns: 1fr; } /* Coluna única no celular */
  .button-group { flex-direction: column; }
  .button-group button { width: 100%; }
}
</style>