<template>
  <div class="comissao-page">
    <h1><i class="fas fa-percentage"></i> Gestão de Comissões</h1>

    <div class="top-actions">
      <button @click="abrirModalNovaComissao">
        <i class="bi bi-plus-circle"></i> <span>Nova Comissão</span>
      </button>
    </div>

    <p v-if="loading" class="loading-text">Carregando comissões...</p>
    
    <div class="table-container" v-else>
      <Table 
        :data="comissoes" 
        :columns="columns"
        :actions="['edit', 'delete']"
        @edit="editarComissao" 
        @delete="removerComissao" 
      />
    </div>

    <Modal :show="modalAberto" @close="fecharModal">
      <template #header></template>

      <div class="form-container">
        <h2>
          <i class="bi bi-percent"></i> 
          {{ modoEdicao ? 'Editar Comissão' : 'Nova Comissão' }}
        </h2>

        <form @submit.prevent="salvarComissao">
          <div class="form-grid">
            <div class="field-group">
              <label for="professor">Professor</label>
              <select id="professor" v-model="form.professorId" required @change="selecionarProfessor">
                <option disabled value="">Selecione o professor</option>
                <option v-for="p in professores" :key="p.id" :value="p.id">
                  {{ p.nome }}
                </option>
              </select>
            </div>

            <div class="field-group">
              <label>Email do Professor</label>
              <input type="email" v-model="form.email" disabled />
            </div>

            <div class="field-group full-width-mobile">
              <label>Modalidade</label>
              <select multiple v-model="form.modalidadeIds" required class="select-multiple">
                <option v-for="m in modalidadesDisponiveis" :key="m.id" :value="m.id">
                  {{ m.nome }}
                </option>
              </select>
              <small class="help-text">Segure Ctrl (ou Cmd) para selecionar várias</small>
            </div>

            <div class="field-group">
              <label for="pagamento">Pagamento (R$)</label>
              <input type="number" id="pagamento" v-model.number="form.pagamentoId" required />
            </div>

            <div class="field-group">
              <label for="porcentagem">Porcentagem (%)</label>
              <input type="number" id="porcentagem" v-model.number="form.porcentagem" min="0" max="100" required />
            </div>

            <div class="field-group">
              <label>Valor da Comissão (R$)</label>
              <input type="text" :value="valorComissao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })" disabled class="input-highlight" />
            </div>
          </div>

          <div class="button-group">
            <button type="button" class="btn-secundario" @click="fecharModal">
               Cancelar
            </button>
            <button type="submit" class="btn-principal">
              <i :class="modoEdicao ? 'bi bi-arrow-repeat' : 'bi bi-plus-circle'"></i> 
              {{ modoEdicao ? 'Atualizar' : 'Cadastrar' }}
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

const comissoes = ref([]);
const professores = ref([]);
const modalidadesDisponiveis = ref([]);
const loading = ref(true);
const modalAberto = ref(false);
const modoEdicao = ref(false);
const escolaId = ref(localStorage.getItem('escolaId') || 5); 

const form = ref({
  id: null,
  professorId: '',
  pagamentoId: 0,
  porcentagem: 0,
  valor: 0,
  email: '',
  modalidadeIds: []
});

const columns = ref([
  { label: 'ID', field: 'id' },
  { label: 'Professor', field: 'professor.nome' },
  { label: 'Email', field: 'professor.email' },
  { label: 'Modalidades', field: 'professor.modalidades', formatter: (val) => val?.map(m => m.nome).join(', ') },
  { label: 'Pagamento (R$)', field: 'pagamentoId' },
  { label: 'Porcentagem (%)', field: 'porcentagem' },
  { label: 'Valor (R$)', field: 'valor' }
]);

const valorComissao = computed(() => {
  const pagamento = parseFloat(form.value.pagamentoId || 0);
  const porcent = parseFloat(form.value.porcentagem || 0);
  return (pagamento * porcent / 100);
});

const carregarComissoes = async () => {
  loading.value = true;
  try {
    const response = await api.get(`/comissoes?escolaId=${escolaId.value}`);
    comissoes.value = response.data || [];
  } catch (err) {
    console.error('Erro ao carregar comissões:', err);
  } finally {
    loading.value = false;
  }
};

const carregarProfessores = async () => {
  try {
    const [resProfessores, resModalidades] = await Promise.all([
      api.get('/professores'),
      api.get('/modalidades')
    ]);
    professores.value = resProfessores.data || [];
    modalidadesDisponiveis.value = resModalidades.data || [];
  } catch (err) {
    console.error('Erro ao carregar dados:', err);
  }
};

const abrirModalNovaComissao = () => {
  modoEdicao.value = false;
  form.value = { id: null, professorId: '', pagamentoId: 0, porcentagem: 0, valor: 0, email: '', modalidadeIds: [] };
  modalAberto.value = true;
};

const fecharModal = () => {
  modalAberto.value = false;
};

const selecionarProfessor = () => {
  const professor = professores.value.find(p => p.id === form.value.professorId);
  if (professor) {
    form.value.email = professor.email || '';
    form.value.modalidadeIds = professor.modalidades?.map(m => m.id) || [];
  } else {
    form.value.email = '';
    form.value.modalidadeIds = [];
  }
};

watch([() => form.value.pagamentoId, () => form.value.porcentagem], () => {
  form.value.valor = valorComissao.value;
});

const salvarComissao = async () => {
  try {
    const payload = {
      ...form.value,
      valor: valorComissao.value,
      escolaId: escolaId.value
    };
    if (modoEdicao.value) {
      await api.put(`/comissoes/${form.value.id}`, payload);
    } else {
      await api.post('/comissoes', payload);
    }
    fecharModal();
    carregarComissoes();
  } catch (err) {
    console.error('Erro ao salvar comissão:', err);
    alert('Erro ao salvar comissão.');
  }
};

const editarComissao = (c) => {
  modoEdicao.value = true;
  form.value = { 
    id: c.id,
    professorId: c.professorId,
    pagamentoId: c.pagamentoId,
    porcentagem: c.porcentagem || 0,
    valor: c.valor || 0,
    email: c.professor?.email || '',
    modalidadeIds: c.professor?.modalidades?.map(m => m.id) || []
  };
  modalAberto.value = true;
};

const removerComissao = async (c) => {
  if (!confirm(`Deseja realmente excluir esta comissão do professor ${c.professor?.nome}?`)) return;
  try {
    await api.delete(`/comissoes/${c.id}`);
    carregarComissoes();
  } catch (err) {
    console.error('Erro ao remover comissão:', err);
  }
};

onMounted(() => {
  carregarProfessores();
  carregarComissoes();
});
</script>

<style scoped>
.comissao-page {
  background-color: #1f1c3a;
  padding: 1.5rem;
  border-radius: 12px;
  min-height: 100%;
}

.comissao-page h1 { 
  color: #f0f0f0; 
  margin-bottom: 1.5rem; 
  font-size: clamp(1.2rem, 5vw, 1.8rem); /* Fonte fluida */
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
  width: auto;
}

.top-actions button:hover { 
  background-color: #ff7eb3; 
  transform: translateY(-2px); 
}

.loading-text {
  color: #c799df;
  text-align: center;
  padding: 2rem;
}

.table-container {
  width: 100%;
  overflow-x: auto; /* Scroll horizontal para mobile */
  background-color: #181529;
  border-radius: 8px;
}

/* FORMULÁRIO DENTRO DO MODAL */
.form-container { 
  padding: 5px; 
  width: 100%;
}

.form-container h2 { 
  text-align: center; 
  color: #e45da9; 
  font-weight: 600; 
  margin-bottom: 1.5rem; 
  font-size: 1.3rem;
  display: flex; 
  align-items: center; 
  justify-content: center; 
  gap: 10px; 
}

.form-grid { 
  display: grid; 
  grid-template-columns: repeat(2, 1fr); 
  gap: 15px; 
}

.field-group {
  display: flex;
  flex-direction: column;
}

label { 
  font-weight: 600; 
  color: #c799df; 
  margin-bottom: 6px; 
  display: block; 
  font-size: 0.85rem; 
}

input, select { 
  width: 100%; 
  padding: 10px; 
  border-radius: 8px; 
  border: 1px solid #3e3e5b; 
  background-color: #181529; 
  color: #f0f0f0; 
  outline: none; 
  font-size: 0.95rem; 
  font-family: 'Poppins', sans-serif; 
  transition: all 0.3s ease; 
}

.input-highlight {
  border-color: #e45da9;
  font-weight: bold;
  color: #ff7eb3;
}

.select-multiple { 
  height: 100px; 
}

.help-text {
  font-size: 0.7rem;
  color: #6a6a8a;
  margin-top: 4px;
}

input:focus, select:focus { 
  border-color: #e45da9; 
  box-shadow: 0 0 8px rgba(228, 93, 169, 0.3); 
}

.button-group { 
  display: flex; 
  flex-direction: row;
  justify-content: flex-end; 
  gap: 10px; 
  margin-top: 2rem; 
  border-top: 1px solid #3e3e5b; 
  padding-top: 1.2rem; 
}

.button-group button { 
  padding: 10px 20px; 
  border: none; 
  border-radius: 8px; 
  color: white; 
  font-weight: 600; 
  cursor: pointer; 
  font-size: 0.9rem; 
  transition: all 0.3s ease; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  gap: 8px;
  flex: 1; /* Botões dividem espaço no mobile */
  max-width: 200px;
}

.btn-principal { background-color: #e45da9; }
.btn-secundario { background-color: #3e3e5b; }

/* MEDIA QUERIES */

/* Tablets */
@media (max-width: 768px) {
  .comissao-page { padding: 1rem; }
  .form-grid { gap: 12px; }
}

/* Celulares */
@media (max-width: 600px) {
  .top-actions { justify-content: center; }
  .top-actions button { width: 100%; justify-content: center; }
  
  .form-grid { 
    grid-template-columns: 1fr; /* Uma coluna só no mobile */
  }
  
  .full-width-mobile {
    grid-column: span 1;
  }

  .button-group {
    flex-direction: column-reverse; /* Botão de ação principal fica em cima no mobile */
  }
  
  .button-group button {
    max-width: none;
    width: 100%;
    padding: 12px;
  }
  
  .comissao-page h1 span {
    font-size: 1.1rem;
  }
}
</style>