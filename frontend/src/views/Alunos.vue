<template>
  <div class="aluno-page">
    <h1>Gerenciar Alunos</h1>

    <div class="top-actions">
      <button @click="openModal()" class="btn-add">Adicionar Aluno</button>
    </div>

    <p v-if="loading" class="status-msg">Carregando alunos...</p>
    
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="loadAlunos">Tentar Novamente</button>
    </div>

    <div class="table-responsive">
      <Table 
        v-if="!loading && !error"
        :data="alunos" 
        :columns="columns"
        :actions="['edit', 'delete']"
        @edit="openModal" 
        @delete="deleteAluno" 
      />
    </div>

    <Modal :show="isModalOpen" @close="closeModal">
      <template #header>
        <h2>{{ editMode ? 'Editar Aluno' : 'Novo Aluno' }}</h2>
      </template>

      <form @submit.prevent="submitForm" class="responsive-form">
        <fieldset>
          <legend>1. Informações Pessoais</legend>
          <div class="form-row">
            <div class="form-group">
              <label for="nome">Nome Completo:</label>
              <input id="nome" v-model="form.nome" required />
            </div>
            <div class="form-group">
              <label for="dataNascimento">Data de Nascimento:</label>
              <input 
                id="dataNascimento" 
                type="date" 
                v-model="form.dataNascimento" 
                max="9999-12-31"
                required 
              />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="genero">Gênero:</label>
              <select id="genero" v-model="form.genero" required>
                <option value="">Selecione</option>
                <option value="Feminino">Feminino</option>
                <option value="Masculino">Masculino</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
            <div class="form-group">
              <label for="telefone">Telefone:</label>
              <input id="telefone" v-model="form.telefone" required />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="cpf">CPF:</label>
              <input id="cpf" v-model="form.cpf" required />
            </div>
            <div class="form-group">
              <label for="email">E-mail:</label>
              <input id="email" type="email" v-model="form.email" required />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>2. Endereço</legend>
          <div class="form-row">
            <div class="form-group cep-group">
              <label for="cep">CEP:</label>
              <input id="cep" v-model="form.cep" @blur="buscarEndereco" required />
            </div>
            <div class="form-group rua-group">
              <label for="rua">Rua:</label>
              <input id="rua" v-model="form.rua" required readonly />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="numero">Número:</label>
              <input id="numero" v-model="form.numero" required />
            </div>
            <div class="form-group">
              <label for="bairro">Bairro:</label>
              <input id="bairro" v-model="form.bairro" required readonly />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="cidade">Cidade:</label>
              <input id="cidade" v-model="form.cidade" required readonly />
            </div>
            <div class="form-group">
              <label for="estado">Estado:</label>
              <input id="estado" v-model="form.estado" required readonly />
            </div>
          </div>
        </fieldset>

        <div class="form-buttons">
          <button type="button" @click="closeModal" class="btn-cancel">Cancelar</button>
          <button type="submit" class="btn-submit">{{ editMode ? 'Atualizar Aluno' : 'Salvar Aluno' }}</button>
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
import axios from 'axios';

const alunos = ref([]);
const loading = ref(true);
const error = ref(null);
const columns = ref([ { label: 'Nome', field: 'nome' }, { label: 'Telefone', field: 'telefone' }, { label: 'Email', field: 'email' } ]);
const isModalOpen = ref(false);
const editMode = ref(false);
const form = ref({ id: null, nome: '', dataNascimento: '', genero: '', telefone: '', cpf: '', email: '', cep: '', rua: '', numero: '', bairro: '', cidade: '', estado: '' });

const loadAlunos = async () => {
  loading.value = true;
  error.value = null;
  try {
    const res = await api.get('/alunos');
    alunos.value = res.data || [];
  } catch (err) {
    console.error('Erro ao carregar alunos:', err);
    if (err.code === 'ECONNABORTED' || axios.isCancel(err)) {
      error.value = 'O servidor demorou muito para responder. Verifique o backend e tente novamente.';
    } else {
      error.value = 'Ocorreu um erro ao buscar os dados. Tente novamente.';
    }
    alunos.value = [];
  } finally {
    loading.value = false;
  }
};

const buscarEndereco = async () => {
  if (!form.value.cep) return;
  const cep = form.value.cep.replace(/\D/g, '');
  if (cep.length !== 8) return;
  try {
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await res.json();
    if (!data.erro) {
      form.value.rua = data.logradouro || '';
      form.value.bairro = data.bairro || '';
      form.value.cidade = data.localidade || '';
      form.value.estado = data.uf || '';
    }
  } catch (err) { console.error('Erro ao buscar CEP:', err); }
};

const resetForm = () => {
  form.value = { id: null, nome: '', dataNascimento: '', genero: '', telefone: '', cpf: '', email: '', cep: '', rua: '', numero: '', bairro: '', cidade: '', estado: '' };
};

const openModal = (alunoToEdit = null) => {
  resetForm();
  if (alunoToEdit && alunoToEdit.id) {
    editMode.value = true;
    form.value = { ...alunoToEdit, dataNascimento: alunoToEdit.dataNascimento ? new Date(alunoToEdit.dataNascimento).toISOString().split('T')[0] : '' };
  } else {
    editMode.value = false;
  }
  isModalOpen.value = true;
};

const closeModal = () => { isModalOpen.value = false; };

const submitForm = async () => {
  try {
    const payload = { ...form.value };
    payload.endereco = `${payload.rua}, ${payload.numero}, ${payload.bairro}, ${payload.cidade} - ${payload.estado}, CEP: ${payload.cep}`;
    if (editMode.value) {
      await api.put(`/alunos/${payload.id}`, payload);
    } else {
      await api.post('/alunos', payload);
    }
    await loadAlunos();
    closeModal();
  } catch (err) {
    console.error('Erro ao salvar aluno:', err);
    alert('Erro ao salvar aluno. Verifique o console para mais detalhes.');
  }
};

const deleteAluno = async (aluno) => {
  if (!confirm(`Deseja realmente excluir o aluno ${aluno.nome}?`)) return;
  try {
    await api.delete(`/alunos/${aluno.id}`);
    await loadAlunos();
  } catch (err) {
    console.error('Erro ao deletar aluno:', err);
    alert('Erro ao deletar aluno. Verifique o console para mais detalhes.');
  }
};

onMounted(loadAlunos);
</script>

<style scoped>
.aluno-page {
  background-color: #1f1c3a;
  padding: 2rem;
  border-radius: 12px;
  min-height: 100vh;
}

.top-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}

.aluno-page h1 {
  color: #f0f0f0;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.btn-add {
  padding: .8rem 1.5rem;
  background-color: #e45da9;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color .2s ease;
}

.btn-add:hover {
  background-color: #ff7eb3;
}

/* Container para rolagem horizontal em mobile */
.table-responsive {
  width: 100%;
  overflow-x: auto;
  margin-top: 1rem;
}

/* Formulário Responsivo */
.responsive-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

fieldset {
  border: 1px solid #3e3e5b;
  padding: 1.5rem;
  border-radius: 8px;
}

legend {
  color: #e45da9;
  font-weight: 600;
  padding: 0 .5rem;
  margin-left: .5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  color: #c799df;
  margin-bottom: .5rem;
  font-size: .9rem;
}

.form-group input,
.form-group select {
  padding: .8rem;
  border: 1px solid #3e3e5b;
  background-color: #181529;
  color: #f0f0f0;
  border-radius: 5px;
  font-size: 1rem;
  width: 100%;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #e45da9;
}

.form-group input:read-only {
  background-color: #2a2a3f;
  cursor: not-allowed;
}

.form-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
  border-top: 1px solid #3e3e5b;
  padding-top: 1.5rem;
}

.form-buttons button {
  padding: .8rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all .2s ease;
}

.btn-submit {
  background-color: #e45da9;
  color: #fff;
}

.btn-submit:hover {
  background-color: #ff7eb3;
}

.btn-cancel {
  background-color: #3e3e5b;
  color: #c799df;
}

.btn-cancel:hover {
  background-color: #555377;
}

.error-message {
  background-color: rgba(255, 77, 77, .1);
  border: 1px solid #ff4d4d;
  color: #ff4d4d;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
}

.status-msg {
  color: #c799df;
  text-align: center;
}

/* Media Queries para Responsividade */
@media (max-width: 768px) {
  .aluno-page {
    padding: 1rem;
  }

  .form-row {
    grid-template-columns: 1fr; /* Coluna única no mobile */
    gap: 1rem;
  }

  .form-buttons {
    flex-direction: column;
  }

  .form-buttons button {
    width: 100%;
  }

  .top-actions {
    justify-content: center;
  }

  .top-actions button {
    width: 100%;
  }
}
</style>