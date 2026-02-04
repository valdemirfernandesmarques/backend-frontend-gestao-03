<template>
  <div class="matricula-page">
    <h1><i class="fas fa-user-plus"></i> Gerenciar Matrículas</h1>

    <div class="top-actions">
      <button @click="openModal()" class="btn-new">
        <i class="bi bi-plus-circle"></i> Nova Matrícula
      </button>
    </div>

    <div v-if="loading" class="loading">Carregando matrículas...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    
    <Table 
      v-else
      :data="matriculasFormatadas" 
      :columns="columns"
      :actions="['edit', 'delete']"
      @edit="editMatricula" 
      @delete="deleteMatricula" 
    />

    <Modal :show="isModalOpen" @close="closeModal">
      <template #header>
        <h2>
          <i class="bi bi-file-earmark-text"></i>
          {{ editMode ? 'Editar Matrícula' : 'Nova Matrícula' }}
        </h2>
      </template>
      
      <div class="form-container">
        <form @submit.prevent="submitForm">
          <div class="form-grid">
            <div class="form-group">
              <label for="aluno">Aluno *</label>
              <select id="aluno" v-model="form.alunoId" required :disabled="editMode">
                <option value="">Selecione um aluno...</option>
                <option v-for="aluno in alunosFiltrados" :key="aluno.id" :value="aluno.id">
                  {{ aluno.nome }} - {{ aluno.email || `ID: ${aluno.id}` }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="turma">Turma *</label>
              <select id="turma" v-model="form.turmaId" required :disabled="editMode">
                <option value="">Selecione uma turma...</option>
                <option v-for="turma in turmasFiltradas" :key="turma.id" :value="turma.id">
                  {{ turma.nome }} - {{ turma.diaDaSemana }} ({{ turma.horarioInicio }})
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="dataMatricula">Data da Matrícula *</label>
              <input 
                type="date" 
                id="dataMatricula" 
                v-model="form.dataMatricula" 
                required 
                max="9999-12-31"
              />
              </div>

            <div class="form-group">
              <label for="valorMensalidade">Valor da Mensalidade (R$) *</label>
              <input 
                type="number" 
                step="0.01" 
                min="0"
                id="valorMensalidade" 
                v-model.number="form.valorMensalidade" 
                required 
                placeholder="0.00"
              />
            </div>

            <div class="form-group">
              <label for="status">Status *</label>
              <select id="status" v-model="form.status" required>
                <option value="ATIVA">Ativa</option>
                <option value="INATIVA">Inativa</option>
                <option value="CONCLUIDA">Concluída</option>
              </select>
            </div>
          </div>

          <div class="button-group">
            <button type="button" class="btn-secundario" @click="closeModal">
              Cancelar
            </button>
            <button type="submit" class="btn-principal" :disabled="submitting">
              <i :class="editMode ? 'bi bi-arrow-repeat' : 'bi bi-check-circle'"></i> 
              {{ submitting ? 'Salvando...' : (editMode ? 'Atualizar' : 'Salvar') }}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import Table from '../components/Table.vue';
import Modal from '../components/Modal.vue';
import api from '../api/api.js';
import { useRoute } from 'vue-router';

// Refs
const matriculas = ref([]);
const alunos = ref([]);
const turmas = ref([]);
const loading = ref(true);
const error = ref('');
const isModalOpen = ref(false);
const editMode = ref(false);
const submitting = ref(false);

const form = ref({
  id: null,
  alunoId: '',
  turmaId: '',
  dataMatricula: '',
  valorMensalidade: 0.00,
  status: 'ATIVA',
  escolaId: parseInt(localStorage.getItem('escolaId')) || 5
});

const route = useRoute();

// Configuração das colunas da tabela
const columns = ref([
  { label: 'ID', field: 'id' },
  { label: 'Aluno', field: 'alunoNome' },
  { label: 'Turma', field: 'turmaNome' },
  { label: 'Data Matrícula', field: 'dataMatriculaFormatada' },
  { label: 'Valor Mensalidade', field: 'valorMensalidadeFormatado' },
  { label: 'Status', field: 'status' }
]);

// Computed
const alunosFiltrados = computed(() => {
  return alunos.value.filter(aluno => aluno.escolaId === form.value.escolaId);
});

const turmasFiltradas = computed(() => {
  return turmas.value.filter(turma => turma.escolaId === form.value.escolaId);
});

const matriculasFormatadas = computed(() => {
  return matriculas.value.map(matricula => {
    const aluno = alunos.value.find(a => a.id === matricula.alunoId);
    const turma = turmas.value.find(t => t.id === matricula.turmaId);
    
    return {
      ...matricula,
      id: matricula.id,
      alunoNome: aluno?.nome || `Aluno ${matricula.alunoId}`,
      turmaNome: turma?.nome || `Turma ${matricula.turmaId}`,
      dataMatriculaFormatada: formatDate(matricula.dataMatricula),
      valorMensalidadeFormatado: formatCurrency(matricula.valorMensalidade),
      status: matricula.status,
      original: matricula
    };
  });
});

// Funções auxiliares
const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  } catch {
    return dateString;
  }
};

const formatCurrency = (value) => {
  if (!value && value !== 0) return '-';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(Number(value));
};

// Função para verificar autenticação
const checkAuth = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Sessão expirada. Redirecionando para login...');
    window.location.href = '/login';
    return false;
  }
  return true;
};

// Função para obter configuração com token
const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

// Carregar dados
const loadData = async () => {
  if (!checkAuth()) return;
  
  loading.value = true;
  error.value = '';
  
  try {
    const authConfig = getAuthConfig();
    const escolaId = form.value.escolaId;

    const [matriculasRes, alunosRes, turmasRes] = await Promise.all([
      api.get('/matriculas', authConfig),
      api.get('/alunos', authConfig),
      api.get('/turmas', authConfig)
    ]);

    matriculas.value = (matriculasRes.data || []).filter(m => m.escolaId === escolaId);
    alunos.value = alunosRes.data || [];
    turmas.value = turmasRes.data || [];

  } catch (err) {
    console.error('Erro ao carregar dados:', err);
    error.value = `Erro ao carregar dados: ${err.response?.data?.message || err.message}`;
    
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  } finally {
    loading.value = false;
  }
};

// Reset do formulário
const resetForm = () => {
  form.value = {
    id: null,
    alunoId: '',
    turmaId: '',
    dataMatricula: new Date().toISOString().split('T')[0],
    valorMensalidade: 0.00,
    status: 'ATIVA',
    escolaId: parseInt(localStorage.getItem('escolaId')) || 5
  };
};

const openModal = () => {
  resetForm();
  editMode.value = false;
  isModalOpen.value = true;
};

const editMatricula = (row) => {
  const matricula = row.original || row;
  editMode.value = true;
  
  form.value = {
    id: matricula.id,
    alunoId: matricula.alunoId,
    turmaId: matricula.turmaId,
    dataMatricula: matricula.dataMatricula?.split('T')[0] || new Date().toISOString().split('T')[0],
    valorMensalidade: parseFloat(matricula.valorMensalidade || 0),
    status: matricula.status || 'ATIVA',
    escolaId: matricula.escolaId || parseInt(localStorage.getItem('escolaId')) || 5
  };
  
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  resetForm();
};

const submitForm = async () => {
  if (!checkAuth()) return;

  if (!form.value.alunoId) { alert('Selecione um aluno.'); return; }
  if (!form.value.turmaId) { alert('Selecione uma turma.'); return; }
  if (!form.value.dataMatricula) { alert('Informe a data da matrícula.'); return; }
  
  // Validação adicional para o ano (impede anos como 0020 ou 20202)
  const ano = new Date(form.value.dataMatricula).getFullYear();
  if (ano < 1900 || ano > 2100) {
    alert('Por favor, insira uma data válida com ano entre 1900 e 2100.');
    return;
  }

  if (form.value.valorMensalidade === null || form.value.valorMensalidade === '' || form.value.valorMensalidade < 0) {
    alert('Informe um valor válido para a mensalidade.');
    return;
  }

  submitting.value = true;

  try {
    const authConfig = getAuthConfig();
    const payload = {
      alunoId: parseInt(form.value.alunoId),
      turmaId: parseInt(form.value.turmaId),
      dataMatricula: form.value.dataMatricula,
      valorMensalidade: parseFloat(form.value.valorMensalidade),
      status: form.value.status,
      escolaId: parseInt(form.value.escolaId)
    };

    if (editMode.value) {
      await api.put(`/matriculas/${form.value.id}`, payload, authConfig);
      alert('Matrícula atualizada com sucesso!');
    } else {
      await api.post('/matriculas', payload, authConfig);
      alert('Matrícula criada com sucesso!');
    }

    await loadData();
    closeModal();

  } catch (err) {
    console.error('Erro ao salvar matrícula:', err);
    alert(`Erro: ${err.response?.data?.message || 'Erro ao salvar matrícula.'}`);
  } finally {
    submitting.value = false;
  }
};

const deleteMatricula = async (row) => {
  if (!checkAuth()) return;
  const matricula = row.original || row;
  if (!confirm(`Deseja realmente excluir a matrícula do aluno "${matricula.alunoNome}"?`)) return;
  
  try {
    const authConfig = getAuthConfig();
    await api.delete(`/matriculas/${matricula.id}`, authConfig);
    await loadData();
    alert('Matrícula excluída com sucesso!');
  } catch (err) {
    console.error('Erro ao excluir matrícula:', err);
    alert('Erro ao excluir matrícula.');
  }
};

watch(() => form.value.turmaId, (newTurmaId) => {
  if (newTurmaId && !editMode.value) {
    const turmaSelecionada = turmas.value.find(t => t.id === parseInt(newTurmaId));
    if (turmaSelecionada) {
      const valorTurma = turmaSelecionada.valorMensalidade || turmaSelecionada.valor || 100.00;
      form.value.valorMensalidade = parseFloat(valorTurma);
    }
  }
});

onMounted(() => {
  if (checkAuth()) {
    loadData();
    if (route.query.action === 'new') {
      openModal();
    }
  }
});
</script>

<style scoped>
.matricula-page {
  padding: 20px;
  background-color: #131129;
  min-height: 100vh;
  color: #ffffff;
}

.matricula-page h1 {
  color: #e45da9;
  margin-bottom: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.5rem;
}

.top-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}

.btn-new {
  padding: 10px 20px;
  background: #e45da9;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-new:hover {
  background: #c34b8e;
  transform: translateY(-1px);
}

.form-container {
  padding: 10px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 500;
  color: #a0aec0;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

input, select {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #3b3b4f;
  background: #1f1c3a;
  color: #ffffff;
  outline: none;
  transition: all 0.3s ease;
}

input:focus, select:focus {
  border-color: #e45da9;
  box-shadow: 0 0 0 2px rgba(228, 93, 169, 0.2);
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #3b3b4f;
}

.button-group button {
  padding: 10px 25px;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 120px;
}

.btn-principal { background: #e45da9; }
.btn-secundario { background: #3b3b4f; }
.loading { text-align: center; padding: 40px; color: #a0aec0; }

@media (max-width: 768px) {
  .matricula-page h1 { font-size: 1.2rem; }
  .top-actions { justify-content: center; }
  .btn-new { width: 100%; justify-content: center; }
  .form-grid { grid-template-columns: 1fr; }
  .button-group { flex-direction: column; }
  .button-group button { width: 100%; }
}
</style>