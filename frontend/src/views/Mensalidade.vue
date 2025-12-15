<template>
  <div class="mensalidade-page">
    <h1>Controle de Mensalidades</h1>

    <div class="top-actions">
      <input v-model="filtroAluno" placeholder="Filtrar por aluno..." />

      <button class="btn-principal" @click="abrirNova">
        Nova Mensalidade
      </button>
    </div>

    <Table
      :data="mensalidadesFiltradas"
      :columns="columns"
      :actions="['edit','delete']"
      @edit="editarMensalidade"
      @delete="excluirMensalidade"
    />

    <!-- MODAL -->
    <Modal :show="modalAberto" @close="fecharModal">
      <template #header>
        {{ editando ? 'Editar Mensalidade' : 'Nova Mensalidade' }}
      </template>

      <form @submit.prevent="salvarMensalidade" class="form">
        <div class="form-grid">

          <!-- MATRÍCULA AGORA EDITÁVEL -->
          <div>
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

          <div>
            <label>Valor (R$)</label>
            <input type="number" step="0.01" v-model.number="form.valor" required />
          </div>

          <div>
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

          <div>
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
          <button type="button" @click="fecharModal">Cancelar</button>
          <button type="submit">
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
    // 🔴 AGORA EDITA MATRÍCULA TAMBÉM
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
