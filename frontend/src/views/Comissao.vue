<template>
  <div class="comissao-page">
    <h1><i class="fas fa-percentage"></i> Gestão de Comissões</h1>

    <div class="top-actions">
      <button @click="abrirModalNovaComissao">
        <i class="bi bi-plus-circle"></i> Nova Comissão
      </button>
    </div>

    <p v-if="loading">Carregando comissões...</p>
    <Table 
      v-else 
      :data="comissoes" 
      :columns="columns"
      :actions="['edit', 'delete']"
      @edit="editarComissao" 
      @delete="removerComissao" 
    />

    <Modal :show="modalAberto" @close="fecharModal">
      <template #header></template>

      <div class="form-container">
        <h2>
          <i class="bi bi-percent"></i> 
          {{ modoEdicao ? 'Editar Comissão' : 'Nova Comissão' }}
        </h2>

        <form @submit.prevent="salvarComissao">
          <div class="form-grid">
            <div>
              <label for="professor">Professor</label>
              <select id="professor" v-model="form.professorId" required @change="selecionarProfessor">
                <option disabled value="">Selecione o professor</option>
                <option v-for="p in professores" :key="p.id" :value="p.id">
                  {{ p.nome }}
                </option>
              </select>
            </div>

            <div>
              <label>Email do Professor</label>
              <input type="email" v-model="form.email" disabled />
            </div>

            <div>
              <label>Modalidade</label>
              <select multiple v-model="form.modalidadeIds" required>
                <option v-for="m in modalidadesDisponiveis" :key="m.id" :value="m.id">
                  {{ m.nome }}
                </option>
              </select>
            </div>

            <div>
              <label for="pagamento">Pagamento (R$)</label>
              <input type="number" id="pagamento" v-model.number="form.pagamentoId" required />
            </div>

            <div>
              <label for="porcentagem">Porcentagem (%)</label>
              <input type="number" id="porcentagem" v-model.number="form.porcentagem" min="0" max="100" required />
            </div>

            <div>
              <label>Valor da Comissão (R$)</label>
              <input type="text" :value="valorComissao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })" disabled />
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
const escolaId = ref(5); // ID da escola logada
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

// -------------------------------
// Computed para calcular valor da comissão
// -------------------------------
const valorComissao = computed(() => {
  const pagamento = parseFloat(form.value.pagamentoId || 0);
  const porcent = parseFloat(form.value.porcentagem || 0);
  return (pagamento * porcent / 100);
});

// -------------------------------
// Funções principais
// -------------------------------
const carregarComissoes = async () => {
  loading.value = true;
  try {
    const response = await api.get(`/comissoes?escolaId=${escolaId.value}`);
    comissoes.value = response.data || [];
  } catch (err) {
    console.error('Erro ao carregar comissões:', err);
    alert('Erro ao carregar comissões.');
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

// Ao selecionar professor, preenche email e modalidades
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
      alert('Comissão atualizada com sucesso!');
    } else {
      await api.post('/comissoes', payload);
      alert('Comissão criada com sucesso!');
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
    alert('Erro ao remover comissão.');
  }
};

// -------------------------------
// Montagem inicial
// -------------------------------
onMounted(() => {
  carregarProfessores();
  carregarComissoes();
});
</script>

<style scoped>
.comissao-page {
  background-color: #1f1c3a;
  padding: 2rem;
  border-radius: 12px;
}
.comissao-page h1 { color: #f0f0f0; margin-bottom: 1.5rem; font-weight: 600; display: flex; align-items: center; gap: 10px; }
.top-actions { display: flex; justify-content: flex-end; margin-bottom: 1.5rem; }
.top-actions button { padding: 0.8rem 1.5rem; background-color: #e45da9; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem; font-weight: 600; transition: all 0.2s ease; display: flex; align-items: center; gap: 8px; }
.top-actions button:hover { background-color: #ff7eb3; transform: translateY(-2px); }

.form-container { padding: 10px; }
.form-container h2 { text-align: center; color: #e45da9; font-weight: 600; margin-bottom: 2rem; display: flex; align-items: center; justify-content: center; gap: 10px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
label { font-weight: 600; color: #c799df; margin-bottom: 8px; display: block; font-size: 0.9rem; }
input, select { width: 100%; padding: 12px; border-radius: 10px; border: 1px solid #3e3e5b; background-color: #181529; color: #f0f0f0; outline: none; font-size: 1rem; font-family: 'Poppins', sans-serif; transition: all 0.3s ease; }
select[multiple] { height: 120px; padding: 10px; }
input:focus, select:focus { border-color: #e45da9; box-shadow: 0 0 8px rgba(228, 93, 169, 0.3); }

.button-group { display: flex; justify-content: flex-end; gap: 15px; margin-top: 2.5rem; border-top: 1px solid #3e3e5b; padding-top: 1.5rem; }
.button-group button { padding: 12px 30px; border: none; border-radius: 10px; color: white; font-weight: 600; cursor: pointer; font-size: 1rem; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 8px; }
.btn-principal { background-color: #e45da9; }
.btn-secundario { background-color: #3e3e5b; }
.button-group button:hover { opacity: 0.9; transform: translateY(-2px); }

@media (max-width: 600px) {
  .form-grid { grid-template-columns: 1fr; }
}
</style>
