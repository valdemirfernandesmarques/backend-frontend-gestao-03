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

    // Filtrar dados pela escola
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

// Abrir modal para nova matrícula
const openModal = () => {
  resetForm();
  editMode.value = false;
  isModalOpen.value = true;
};

// Editar matrícula
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

// Fechar modal
const closeModal = () => {
  isModalOpen.value = false;
  resetForm();
};

// Enviar formulário - Versão Simplificada
const submitForm = async () => {
  if (!checkAuth()) return;

  // Validações
  if (!form.value.alunoId) {
    alert('Selecione um aluno.');
    return;
  }
  if (!form.value.turmaId) {
    alert('Selecione uma turma.');
    return;
  }
  if (!form.value.dataMatricula) {
    alert('Informe a data da matrícula.');
    return;
  }
  if (form.value.valorMensalidade === null || form.value.valorMensalidade === '' || form.value.valorMensalidade < 0) {
    alert('Informe um valor válido para a mensalidade.');
    return;
  }

  submitting.value = true;

  try {
    const authConfig = getAuthConfig();
    
    // Payload simplificado
    const payload = {
      alunoId: parseInt(form.value.alunoId),
      turmaId: parseInt(form.value.turmaId),
      dataMatricula: form.value.dataMatricula,
      valorMensalidade: parseFloat(form.value.valorMensalidade),
      status: form.value.status,
      escolaId: parseInt(form.value.escolaId)
    };

    if (editMode.value) {
      // Atualização
      await api.put(`/matriculas/${form.value.id}`, payload, authConfig);
      alert('Matrícula atualizada com sucesso!');
    } else {
      // Criação
      await api.post('/matriculas', payload, authConfig);
      alert('Matrícula criada com sucesso!');
    }

    await loadData();
    closeModal();

  } catch (err) {
    console.error('Erro ao salvar matrícula:', err);
    
    let errorMessage = 'Erro ao salvar matrícula. Verifique os dados.';
    
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    }
    
    alert(`Erro: ${errorMessage}`);
  } finally {
    submitting.value = false;
  }
};

// Excluir matrícula
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

// Watch para atualizar valor da mensalidade quando turma for selecionada
watch(() => form.value.turmaId, (newTurmaId) => {
  if (newTurmaId && !editMode.value) {
    const turmaSelecionada = turmas.value.find(t => t.id === parseInt(newTurmaId));
    if (turmaSelecionada) {
      const valorTurma = turmaSelecionada.valorMensalidade || turmaSelecionada.valor || 100.00;
      form.value.valorMensalidade = parseFloat(valorTurma);
    }
  }
});

// Inicialização
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
  background: #f8f9fa;
  min-height: 100vh;
}

.matricula-page h1 {
  color: #2d3748;
  margin-bottom: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
}

.top-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}

.btn-new {
  padding: 12px 24px;
  background: #9f7aea;
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

.btn-new:hover {
  background: #805ad5;
  transform: translateY(-1px);
}

.form-container {
  padding: 20px;
}

.form-container h2 {
  text-align: center;
  color: #2d3748;
  font-weight: 600;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

input, select {
  width: 100%;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #cbd5e0;
  background: white;
  color: #2d3748;
  outline: none;
  font-size: 1rem;
  transition: all 0.3s ease;
}

input:focus, select:focus {
  border-color: #9f7aea;
  box-shadow: 0 0 0 3px rgba(159, 122, 234, 0.1);
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.button-group button {
  padding: 12px 30px;
  border: none;
  border-radius: 6px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 120px;
}

.btn-principal {
  background: #9f7aea;
}

.btn-principal:hover:not(:disabled) {
  background: #805ad5;
}

.btn-principal:disabled {
  background: #a0aec0;
  cursor: not-allowed;
}

.btn-secundario {
  background: #718096;
}

.btn-secundario:hover {
  background: #4a5568;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #4a5568;
  font-style: italic;
}

.error-message {
  padding: 15px;
  margin: 20px 0;
  background: #fed7d7;
  color: #c53030;
  border-radius: 8px;
  font-weight: bold;
  text-align: center;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .button-group {
    flex-direction: column;
  }
  
  .button-group button {
    width: 100%;
  }
}
</style>