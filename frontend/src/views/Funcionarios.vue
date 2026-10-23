<template>
  <div class="funcionario-page">
    <h1><i class="fas fa-users-cog"></i> Gerenciar Funcionários</h1>

    <div class="top-actions">
      <button @click="openModal()">
        <i class="bi bi-plus-circle"></i> Adicionar Funcionário
      </button>
    </div>

    <p v-if="loading">Carregando funcionários...</p>
    <Table 
      v-else 
      :data="funcionarios" 
      :columns="columns"
      :actions="['edit', 'delete']"
      @edit="openModal" 
      @delete="deleteFuncionario" 
    />

    <Modal :show="isModalOpen" @close="closeModal">
      <template #header></template>
      
      <div class="form-container">
        <h2>
          <i class="bi bi-person-badge"></i>
          {{ editMode ? 'Editar Funcionário' : 'Cadastro de Funcionário' }}
        </h2>

        <form @submit.prevent="submitForm">
          <fieldset>
            <legend>1. Informações Pessoais</legend>
            <div class="form-grid">
              <div>
                <label for="nomeCompleto">Nome Completo</label>
                <input type="text" id="nomeCompleto" v-model="form.nomeCompleto" required />
              </div>
              <div>
                <label for="nomeSocial">Nome Social</label>
                <input type="text" id="nomeSocial" v-model="form.nomeSocial" />
              </div>
              <div>
                <label for="dataNascimento">Data de Nascimento</label>
                <input type="date" id="dataNascimento" v-model="form.dataNascimento" max="9999-12-31" required />
              </div>
              <div>
                <label for="nacionalidade">Nacionalidade</label>
                <input type="text" id="nacionalidade" v-model="form.nacionalidade" />
              </div>
              <div>
                <label for="naturalidade">Naturalidade</label>
                <input type="text" id="naturalidade" v-model="form.naturalidade" />
              </div>
              <div>
                <label for="estadoCivil">Estado Civil</label>
                <select id="estadoCivil" v-model="form.estadoCivil">
                  <option value="">Selecione</option>
                  <option value="Solteiro(a)">Solteiro(a)</option>
                  <option value="Casado(a)">Casado(a)</option>
                  <option value="Divorciado(a)">Divorciado(a)</option>
                  <option value="Viuvo(a)">Viúvo(a)</option>
                </select>
              </div>
              <div>
                <label for="genero">Gênero</label>
                <select id="genero" v-model="form.genero">
                  <option value="">Selecione</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              <div>
                <label for="cpf">CPF</label>
                <input type="text" id="cpf" v-model="form.cpf" required />
              </div>
              <div>
                <label for="rg">RG</label>
                <input type="text" id="rg" v-model="form.rg" />
              </div>
            </div>
          </fieldset>
          
          <fieldset>
            <legend>2. Contato</legend>
            <div class="form-grid">
               <div>
                <label for="telefone">Telefone Celular</label>
                <input type="tel" id="telefone" v-model="form.telefone" required />
              </div>
              <div>
                <label for="email">E-mail Pessoal</label>
                <input type="email" id="email" v-model="form.email" required />
              </div>
              <div class="full-width-field">
                <label for="cep">CEP</label>
                <input type="text" id="cep" v-model="form.cep" @blur="buscarEndereco" required />
              </div>
              <div>
                <label for="rua">Rua</label>
                <input type="text" id="rua" v-model="form.rua" readonly>
              </div>
              <div>
                <label for="numero">Número</label>
                <input type="text" id="numero" v-model="form.numero" required>
              </div>
              <div>
                <label for="bairro">Bairro</label>
                <input type="text" id="bairro" v-model="form.bairro" readonly>
              </div>
              <div>
                <label for="cidade">Cidade</label>
                <input type="text" id="cidade" v-model="form.cidade" readonly>
              </div>
              <div>
                <label for="estado">Estado</label>
                <input type="text" id="estado" v-model="form.estado" readonly>
              </div>
            </div>
          </fieldset>
          
          <fieldset>
            <legend>3. Informações Profissionais</legend>
            <div class="form-grid">
              <div>
                <label for="cargo">Cargo</label>
                <input type="text" id="cargo" v-model="form.cargo" required>
              </div>
              <div>
                <label for="salario">Salário Base (R$)</label>
                <input type="number" step="0.01" id="salario" v-model="form.salario" required>
              </div>
              <div>
                <label for="dataAdmissao">Data de Admissão</label>
                <input type="date" id="dataAdmissao" v-model="form.dataAdmissao" max="9999-12-31" required>
              </div>
            </div>
          </fieldset>

          <div class="button-group">
            <button type="button" class="btn-secundario" @click="closeModal">Cancelar</button>
            <button type="submit" class="btn-principal">
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

const funcionarios = ref([]);
const loading = ref(true);
const columns = ref([
  { label: 'Nome Completo', field: 'nomeCompleto' },
  { label: 'Cargo', field: 'cargo' },
  { label: 'Telefone', field: 'telefone' }
]);
const isModalOpen = ref(false);
const editMode = ref(false);
const form = ref({
  id: null, nomeCompleto: '', nomeSocial: '', dataNascimento: '', nacionalidade: '', naturalidade: '',
  estadoCivil: '', genero: '', cpf: '', rg: '',
  telefone: '', email: '', cep: '', rua: '', numero: '', bairro: '', cidade: '', estado: '',
  cargo: '', dataAdmissao: '', salario: null,
});

const loadData = async () => {
  loading.value = true;
  try {
    const response = await api.get('/funcionarios');
    funcionarios.value = response.data || [];
  } catch (err) { console.error('Erro ao carregar funcionários:', err); }
  finally { loading.value = false; }
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
  form.value = {
    id: null, nomeCompleto: '', nomeSocial: '', dataNascimento: '', nacionalidade: '', naturalidade: '',
    estadoCivil: '', genero: '', cpf: '', rg: '',
    telefone: '', email: '', cep: '', rua: '', numero: '', bairro: '', cidade: '', estado: '',
    cargo: '', dataAdmissao: '', salario: null,
  };
};

const openModal = (funcionarioToEdit = null) => {
  resetForm();
  if (funcionarioToEdit && funcionarioToEdit.id) {
    editMode.value = true;
    
    const funcionarioData = { 
        ...funcionarioToEdit,
        dataNascimento: funcionarioToEdit.dataNascimento ? new Date(funcionarioToEdit.dataNascimento).toISOString().split('T')[0] : '',
        dataAdmissao: funcionarioToEdit.dataAdmissao ? new Date(funcionarioToEdit.dataAdmissao).toISOString().split('T')[0] : ''
    };

    if (funcionarioData.endereco && typeof funcionarioData.endereco === 'string') {
        const parts = funcionarioData.endereco.split(', ');
        funcionarioData.rua = parts[0] || '';
        funcionarioData.numero = parts[1] || '';
        funcionarioData.bairro = parts[2] || '';
        const cidadeEstado = (parts[3] || '').split(' - ');
        funcionarioData.cidade = cidadeEstado[0] || '';
        funcionarioData.estado = cidadeEstado[1] || '';
        if (parts[4] && parts[4].includes('CEP:')) {
          funcionarioData.cep = parts[4].replace('CEP: ', '');
        }
    }
    form.value = funcionarioData;

  } else {
    editMode.value = false;
  }
  isModalOpen.value = true;
};

const closeModal = () => { isModalOpen.value = false; };

const submitForm = async () => {
  try {
    const escolaId = localStorage.getItem('escolaId');
    if (!escolaId) {
      alert('Erro: ID da escola não encontrado. Faça o login novamente.');
      return;
    }
    
    const payload = { ...form.value, escolaId: parseInt(escolaId) };
    payload.endereco = `${payload.rua}, ${payload.numero}, ${payload.bairro}, ${payload.cidade} - ${payload.estado}, CEP: ${payload.cep}`;

    if (editMode.value) {
      await api.put(`/funcionarios/${payload.id}`, payload);
    } else {
      await api.post('/funcionarios', payload);
    }
    await loadData();
    closeModal();
  } catch (err) {
    console.error('Erro ao salvar funcionário:', err);
    alert('Erro ao salvar funcionário.');
  }
};

const deleteFuncionario = async (funcionario) => {
  if (!confirm(`Deseja realmente excluir o funcionário ${funcionario.nomeCompleto}?`)) return;
  try {
    await api.delete(`/funcionarios/${funcionario.id}`);
    await loadData();
  } catch (err) {
    console.error('Erro ao deletar funcionário:', err);
    alert('Erro ao deletar funcionário.');
  }
};

onMounted(loadData);
</script>

<style scoped>
/* Estilos da página e formulário seguindo o padrão profissional */
.funcionario-page { background-color: #1f1c3a; padding: 2rem; border-radius: 12px; }
.funcionario-page h1 { color: #f0f0f0; margin-bottom: 1.5rem; font-weight: 600; display: flex; align-items: center; gap: 10px; }
.top-actions { display: flex; justify-content: flex-end; margin-bottom: 1.5rem; }
.top-actions button { padding: 0.8rem 1.5rem; background-color: #e45da9; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem; font-weight: 600; transition: all 0.2s ease; display: flex; align-items: center; gap: 8px; }
.top-actions button:hover { background-color: #ff7eb3; transform: translateY(-2px); }

.form-container { padding: 10px; }
.form-container h2 { text-align: center; color: #e45da9; font-weight: 600; margin-bottom: 2rem; display: flex; align-items: center; justify-content: center; gap: 10px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.full-width-field { grid-column: 1 / -1; }
label { font-weight: 600; color: #c799df; margin-bottom: 8px; display: block; font-size: 0.9rem; }
input, select, textarea { width: 100%; padding: 12px; border-radius: 10px; border: 1px solid #3e3e5b; background-color: #181529; color: #f0f0f0; outline: none; font-size: 1rem; font-family: 'Poppins', sans-serif; transition: all 0.3s ease; }
input:focus, select:focus, textarea:focus { border-color: #e45da9; box-shadow: 0 0 8px rgba(228, 93, 169, 0.3); }
input:read-only { background-color: #2a2a3f; cursor: not-allowed; }
.button-group { display: flex; justify-content: flex-end; gap: 15px; margin-top: 2.5rem; border-top: 1px solid #3e3e5b; padding-top: 1.5rem; }
.button-group button { flex-grow: 0; padding: 12px 30px; border: none; border-radius: 10px; color: white; font-weight: 600; cursor: pointer; font-size: 1rem; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 8px; }
.btn-principal { background-color: #e45da9; }
.btn-secundario { background-color: #3e3e5b; }
.button-group button:hover { opacity: 0.9; transform: translateY(-2px); }

/* ===================== RESPONSIVIDADE (APENAS ADIÇÃO) ===================== */

@media (max-width: 1024px) {
  .funcionario-page {
    padding: 1.5rem;
  }
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .button-group {
    flex-direction: column;
    align-items: stretch;
  }

  .top-actions {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .funcionario-page {
    padding: 1rem;
  }

  .funcionario-page h1 {
    font-size: 1.2rem;
    flex-wrap: wrap;
    justify-content: center;
    text-align: center;
  }
}
</style>