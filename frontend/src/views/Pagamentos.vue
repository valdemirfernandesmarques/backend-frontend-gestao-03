<template>
  <div class="financeiro-page">
    <h1><i class="bi bi-cash-coin"></i> Financeiro — Pagamentos</h1>

    <p v-if="loading">Carregando financeiro...</p>

    <table v-else class="tabela">
      <thead>
        <tr>
          <th>Aluno</th>
          <th>Vencimento</th>
          <th>Valor</th>
          <th>Status</th>
          <th>Ação</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="m in mensalidades" :key="m.id">
          <td>{{ m.matricula?.aluno?.nome || '—' }}</td>
          <td>{{ formatDate(m.dataVencimento) }}</td>
          <td>R$ {{ m.valor }}</td>
          <td>
            <span :class="['status', m.status.toLowerCase()]">{{ m.status }}</span>
          </td>
          <td>
            <button
              class="btn"
              :disabled="m.status === 'PAGO'"
              @click="abrirModal(m)"
            >
              {{ m.status === 'PAGO' ? 'Pago' : 'Receber' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showModal" class="modal-backdrop">
      <div class="modal">
        <h3>Registrar Pagamento</h3>

        <div class="campo">
          <label>Valor</label>
          <input type="number" step="0.01" v-model="form.valor" />
        </div>

        <div class="campo">
          <label>Data do Pagamento</label>
          <input
            type="text"
            placeholder="DD/MM/AAAA"
            maxlength="10"
            v-model="form.dataPagamento"
            @input="mascaraData"
          />
        </div>

        <div class="campo">
          <label>Método</label>
          <select v-model="form.metodo">
            <option value="PIX">PIX</option>
            <option value="Crédito">Crédito</option>
            <option value="Débito">Débito</option>
            <option value="Dinheiro">Dinheiro</option>
          </select>
        </div>

        <div class="acoes">
          <button class="btn-sec" @click="fecharModal">Cancelar</button>
          <button class="btn-pri" @click="confirmarPagamento">Confirmar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api/api.js'

const mensalidades = ref([])
const loading = ref(true)
const showModal = ref(false)
const mensalidadeSelecionada = ref(null)

const form = ref({
  valor: '',
  dataPagamento: '',
  metodo: 'PIX'
})

const loadMensalidades = async () => {
  loading.value = true
  try {
    const res = await api.get('/mensalidades')
    mensalidades.value = res.data || []
  } catch (e) {
    alert('Erro ao carregar mensalidades')
  } finally {
    loading.value = false
  }
}

const abrirModal = (m) => {
  if (m.status === 'PAGO') {
    alert('Pagamento já efetuado!')
    return
  }
  mensalidadeSelecionada.value = m
  form.value.valor = m.valor
  form.value.dataPagamento = ''
  form.value.metodo = 'PIX'
  showModal.value = true
}

const fecharModal = () => {
  showModal.value = false
}

const confirmarPagamento = async () => {
  try {
    const [dia, mes, ano] = form.value.dataPagamento.split('/')

    await api.post('/pagamentos', {
      mensalidadeId: mensalidadeSelecionada.value.id,
      valor: form.value.valor,
      metodo: form.value.metodo,
      dataPagamento: `${ano}-${mes}-${dia}`
    })

    showModal.value = false
    await loadMensalidades()
    alert('Pagamento registrado com sucesso')
  } catch (e) {
    alert('Erro ao registrar pagamento')
  }
}

const mascaraData = () => {
  let v = form.value.dataPagamento.replace(/\D/g, '')
  if (v.length > 8) v = v.slice(0, 8)
  if (v.length >= 5) v = v.replace(/(\d{2})(\d{2})(\d+)/, '$1/$2/$3')
  else if (v.length >= 3) v = v.replace(/(\d{2})(\d+)/, '$1/$2')
  form.value.dataPagamento = v
}

const formatDate = (d) => {
  if (!d) return '—'
  const [y, m, day] = d.split('-')
  return `${day}/${m}/${y}`
}

onMounted(loadMensalidades)
</script>

<style scoped>
.financeiro-page {
  padding: 2rem;
  background: #1f1c3a;
  border-radius: 12px;
}

h1 {
  color: #fff;
  margin-bottom: 1.5rem;
}

.tabela {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px;
  border-bottom: 1px solid #333;
  color: #eee;
}

.status.pago { color: #4caf50 }
.status.pendente { color: #ffc107 }

.btn {
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

.btn:disabled {
  background: #555;
  cursor: not-allowed;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: #181529;
  padding: 20px;
  border-radius: 10px;
  width: 350px;
}

.campo {
  margin-bottom: 12px;
}

label { color: #c799df; font-size: 0.9rem }

input, select {
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #333;
  background: #12101f;
  color: #fff;
}

.acoes {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-pri { background: #e45da9; color: #fff }
.btn-sec { background: #3e3e5b; color: #fff }
</style>
