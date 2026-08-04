<template>
  <div class="financeiro-wrapper">

    <!-- HEADER -->
    <div class="financeiro-header">
      <h1><i class="bi bi-cash-coin"></i> Financeiro</h1>
      <p>Controle de mensalidades, pagamentos e caixa</p>
    </div>

    <!-- RESUMO FINANCEIRO (INALTERADO) -->
    <div class="financeiro-resumo">
      <div class="resumo-card entrada">
        <span>Entradas</span>
        <strong>R$ {{ totalEntradas }}</strong>
      </div>

      <div class="resumo-card pendente">
        <span>Pendentes</span>
        <strong>R$ {{ totalPendentes }}</strong>
      </div>

      <div class="resumo-card total">
        <span>Total Geral</span>
        <strong>R$ {{ totalGeral }}</strong>
      </div>
    </div>

    <!-- TABELA -->
    <div class="financeiro-card">
      <h2>Mensalidades</h2>

      <p v-if="loading" class="loading">Carregando financeiro...</p>

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
              <span :class="['status', m.status.toLowerCase()]">
                {{ m.status }}
              </span>
            </td>
            <td>
              <button
                class="btn receber"
                :disabled="m.status === 'PAGO'"
                @click="abrirModal(m)"
              >
                {{ m.status === 'PAGO' ? 'Pago' : 'Receber' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODAL PAGAMENTO -->
    <div v-if="showModal" class="modal-backdrop">
      <div class="modal">
        <h3><i class="bi bi-credit-card"></i> Registrar Pagamento</h3>

        <div class="form-grid">
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
              <option value="CREDITO">Crédito</option>
              <option value="DEBITO">Débito</option>
              <option value="DINHEIRO">Dinheiro</option>
            </select>
          </div>
        </div>

        <div class="acoes">
          <button class="btn-sec" @click="fecharModal">Cancelar</button>
          <button class="btn-pri" @click="confirmarPagamento">
            Confirmar Pagamento
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../api/api'

const mensalidades = ref([])
const vendas = ref([])
const loading = ref(true)
const showModal = ref(false)
const mensalidadeSelecionada = ref(null)

const form = ref({
  valor: '',
  dataPagamento: '',
  metodo: 'PIX'
})

const loadFinanceiro = async () => {
  loading.value = true
  try {
    const resMensalidades = await api.get('/mensalidades')
    const resVendas = await api.get('/vendas')

    mensalidades.value = resMensalidades.data || []
    vendas.value = resVendas.data || []
  } catch (e) {
    alert('Erro ao carregar financeiro')
  } finally {
    loading.value = false
  }
}

const abrirModal = (m) => {
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
    await loadFinanceiro()
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

/* ===== RESUMOS ===== */

const totalMensalidadesPagas = computed(() =>
  mensalidades.value
    .filter(m => m.status === 'PAGO')
    .reduce((s, m) => s + Number(m.valor), 0)
)

const totalVendas = computed(() =>
  vendas.value
    .filter(v => v.status === 'Concluida')
    .reduce((s, v) => s + Number(v.totalLiquido), 0)
)

const totalEntradas = computed(() =>
  (totalMensalidadesPagas.value + totalVendas.value).toFixed(2)
)

const totalPendentes = computed(() =>
  mensalidades.value
    .filter(m => m.status !== 'PAGO')
    .reduce((s, m) => s + Number(m.valor), 0)
    .toFixed(2)
)

const totalGeral = computed(() =>
  (Number(totalEntradas.value) + Number(totalPendentes.value)).toFixed(2)
)

onMounted(loadFinanceiro)
</script>

<style scoped>
/* ===== ESTILO BASE (INALTERADO) ===== */
.financeiro-wrapper {
  padding: 24px;
  background: #1f2937;
  min-height: 100vh;
  color: #f3f4f6;
}

.financeiro-header h1 {
  color: #ec4899;
}
.financeiro-header p {
  color: #9ca3af;
  margin-bottom: 20px;
}

.financeiro-resumo {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 25px;
}

.resumo-card {
  background: #374151;
  padding: 15px;
  border-radius: 10px;
}
.resumo-card span {
  font-size: 0.85rem;
  color: #9ca3af;
}
.resumo-card strong {
  font-size: 1.6rem;
}
.resumo-card.entrada strong { color: #10b981 }
.resumo-card.pendente strong { color: #f59e0b }
.resumo-card.total strong { color: #ec4899 }

.financeiro-card {
  background: #374151;
  padding: 20px;
  border-radius: 12px;
}

.tabela {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 12px;
  border-bottom: 1px solid #4b5563;
}
.status.pago { color: #10b981 }
.status.pendente { color: #f59e0b }

.btn {
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}
.btn.receber {
  background: #8b5cf6;
  color: #fff;
}
.btn:disabled {
  background: #6b7280;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: #111827;
  padding: 20px;
  border-radius: 12px;
  width: 420px;
}

.form-grid {
  display: grid;
  gap: 12px;
}

label {
  font-size: 0.85rem;
  color: #9ca3af;
}

input, select {
  width: 100%;
  padding: 8px;
  background: #1f2937;
  border: 1px solid #374151;
  color: #fff;
  border-radius: 6px;
}

.acoes {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
}

.btn-pri {
  background: #ec4899;
  color: #fff;
}
.btn-sec {
  background: #374151;
  color: #fff;
}

/* ===== TABLET ===== */
@media (max-width: 1024px) {
  .financeiro-resumo {
    grid-template-columns: 1fr 1fr;
  }

  .modal {
    width: 90%;
  }
}

/* ===== CELULAR ===== */
@media (max-width: 600px) {
  .financeiro-wrapper {
    padding: 16px;
  }

  .financeiro-resumo {
    grid-template-columns: 1fr;
  }

  .tabela thead {
    display: none;
  }

  .tabela tr {
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid #4b5563;
    padding: 10px 0;
  }

  .tabela td {
    border: none;
    padding: 6px 0;
  }

  .acoes {
    flex-direction: column;
  }

  .acoes button {
    width: 100%;
  }

  .modal {
    width: 95%;
  }
}
</style>
