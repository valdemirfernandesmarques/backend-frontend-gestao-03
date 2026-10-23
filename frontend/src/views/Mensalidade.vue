<template>
  <div class="mensalidade-page">
    <h1>Controle de Mensalidades</h1>

    <div class="top-actions">
      <div class="search-box">
        <input v-model="filtroAluno" placeholder="Filtrar por aluno..." />
      </div>

      <button class="btn-principal" @click="abrirNova">
        <i class="fas fa-plus"></i> <span>Nova Mensalidade</span>
      </button>
    </div>

    <div class="table-responsive">
      <Table
        :data="mensalidadesFiltradas"
        :columns="columns"
        :actions="['edit','delete']"
        @edit="editarMensalidade"
        @delete="excluirMensalidade"
      />
    </div>

    <Modal :show="modalAberto" @close="fecharModal">
      <template #header>
        {{ editando ? 'Editar Mensalidade' : 'Nova Mensalidade' }}
      </template>

      <form @submit.prevent="salvarMensalidade" class="form">
        <div class="form-grid">

          <div class="field-group full-width">
            <label>Matrícula</label>
            <select v-model="form.matriculaId" required>
              <option value="">Selecione...</option>
              <option
                v-for="m in matriculas"
                :key="m.id"
                :value="m.id"
              >
                {{ m.alunoNome }} - {{ m.turmaNome }}
              </option>
            </select>
          </div>

          <div class="field-group">
            <label>Valor (R$)</label>
            <input type="number" step="0.01" v-model.number="form.valor" required />
          </div>

          <div class="field-group">
            <label>Data de Vencimento </label>
            <input
              type="text"
              v-model="form.dataVencimento"
              maxlength="10"
              placeholder="DD/MM/AAAA"
              @input="mascaraData"
              required
            />
          </div>

          <div class="field-group full-width-mobile">
            <label>Status</label>
            <select v-model="form.status">
              <option value="PENDENTE">Pendente</option>
              <option value="PAGO">Pago</option>
              <option value="ATRASADO">Atrasado</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
          </div>

        </div>

        <div class="actions">
          <button type="button" class="btn-cancel" @click="fecharModal">Cancelar</button>
          <button type="submit" class="btn-save">
            {{ editando ? 'Atualizar' : 'Salvar' }}
          </button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../api/api'
import Table from '../components/Table.vue'
import Modal from '../components/Modal.vue'

const mensalidades = ref([])
const matriculas = ref([])

const filtroAluno = ref('')
const modalAberto = ref(false)
const editando = ref(false)

const form = ref({
  id: null,
  matriculaId: '',
  valor: null,
  dataVencimento: '',
  status: 'PENDENTE'
})

const columns = [
  { label: 'ID', field: 'id' },
  { label: 'Aluno', field: 'alunoNome' },
  { label: 'Turma', field: 'turmaNome' },
  { label: 'Valor', field: 'valor' },
  { label: 'Vencimento', field: 'dataVencimento' },
  { label: 'Status', field: 'status' }
]

const mensalidadesFiltradas = computed(() =>
  mensalidades.value.filter(m =>
    m.alunoNome.toLowerCase().includes(filtroAluno.value.toLowerCase())
  )
)

const auth = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
})

const carregarDados = async () => {
  const [mens, mats] = await Promise.all([
    api.get('/mensalidades', auth()),
    api.get('/matriculas', auth())
  ])

  mensalidades.value = mens.data.map(m => ({
    id: m.id,
    matriculaId: m.matriculaId,
    alunoNome: m.matricula?.aluno?.nome ?? '',
    turmaNome: m.matricula?.turma?.nome ?? '',
    valor: m.valor,
    dataVencimento: formatarBR(m.dataVencimento),
    status: m.status
  }))

  matriculas.value = mats.data.map(m => ({
    id: m.id,
    alunoId: m.alunoId,
    turmaId: m.turmaId,
    alunoNome: m.aluno?.nome ?? '',
    turmaNome: m.turma?.nome ?? ''
  }))
}

const abrirNova = () => {
  editando.value = false
  form.value = {
    id: null,
    matriculaId: '',
    valor: null,
    dataVencimento: '',
    status: 'PENDENTE'
  }
  modalAberto.value = true
}

const editarMensalidade = row => {
  editando.value = true
  form.value = { ...row }
  modalAberto.value = true
}

const salvarMensalidade = async () => {
  const matricula = matriculas.value.find(m => m.id === form.value.matriculaId)
  const dataISO = formatarISO(form.value.dataVencimento)

  if (editando.value) {
    await api.put(`/mensalidades/${form.value.id}`, {
      alunoId: matricula.alunoId,
      turmaId: matricula.turmaId,
      valor: form.value.valor,
      dataVencimento: dataISO,
      status: form.value.status
    }, auth())
  } else {
    await api.post('/mensalidades', {
      alunoId: matricula.alunoId,
      turmaId: matricula.turmaId,
      valor: form.value.valor,
      dataVencimento: dataISO
    }, auth())
  }

  await carregarDados()
  fecharModal()
}

const excluirMensalidade = async row => {
  if (!confirm(`Excluir mensalidade #${row.id}?`)) return
  await api.delete(`/mensalidades/${row.id}`, auth())
  await carregarDados()
}

const fecharModal = () => modalAberto.value = false

const mascaraData = () => {
  let v = form.value.dataVencimento.replace(/\D/g, '').slice(0, 8)
  if (v.length >= 5) v = v.replace(/(\d{2})(\d{2})(\d+)/, '$1/$2/$3')
  else if (v.length >= 3) v = v.replace(/(\d{2})(\d+)/, '$1/$2')
  form.value.dataVencimento = v
}

const formatarBR = iso =>
  iso?.split('T')[0].split('-').reverse().join('/')

const formatarISO = br =>
  br.split('/').reverse().join('-')

onMounted(carregarDados)
</script>

<style scoped>
.mensalidade-page {
  padding: 20px;
  background-color: #181529;
  min-height: 100vh;
  color: #fff;
}

h1 {
  margin-bottom: 25px;
  font-size: 1.8rem;
  color: #ff3c78;
}

/* AÇÕES DO TOPO */
.top-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 15px;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 250px;
}

.search-box input {
  width: 100%;
  padding: 12px 16px;
  background: #2c2c3e;
  border: 1px solid #444;
  border-radius: 8px;
  color: #fff;
  outline: none;
}

.btn-principal {
  background-color: #ff3c78;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: opacity 0.2s;
}

.btn-principal:hover {
  opacity: 0.9;
}

/* TABELA */
.table-responsive {
  width: 100%;
  overflow-x: auto;
  background: #2c2c3e;
  border-radius: 12px;
  padding: 10px;
}

/* FORMULÁRIO NO MODAL */
.form {
  padding: 10px 0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.full-width {
  grid-column: span 2;
}

label {
  font-size: 0.9rem;
  color: #ccc;
}

input, select {
  padding: 12px;
  background: #181529;
  border: 1px solid #444;
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 30px;
  border-top: 1px solid #444;
  padding-top: 20px;
}

.actions button {
  padding: 12px 25px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  border: none;
}

.btn-cancel {
  background: #444;
  color: #fff;
}

.btn-save {
  background: #ff3c78;
  color: #fff;
}

/* --- RESPONSIVIDADE (MEDIA QUERIES) --- */

@media (max-width: 768px) {
  .top-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    min-width: 100%;
  }

  .btn-principal {
    justify-content: center;
  }

  .form-grid {
    grid-template-columns: 1fr; /* Uma coluna no tablet e celular */
  }

  .full-width {
    grid-column: span 1;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.4rem;
  }

  .btn-principal span {
    display: inline; /* Mantém o texto no mobile para clareza */
  }

  .actions {
    flex-direction: column-reverse;
  }

  .actions button {
    width: 100%;
  }
}
</style>