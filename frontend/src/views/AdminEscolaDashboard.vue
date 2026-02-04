<template>
  <div class="dashboard" ref="areaPDF">

    <div class="kpis">
      <div class="kpi">
        <span>Receita do mês</span>
        <strong>R$ {{ kpis.receitaMes.toFixed(2) }}</strong>
      </div>
      <div class="kpi">
        <span>Alunos ativos</span>
        <strong>{{ kpis.alunosAtivos }}</strong>
      </div>
      <div class="kpi">
        <span>Inadimplência</span>
        <strong>{{ kpis.inadimplentes }}</strong>
      </div>
    </div>

    <div class="filters">
      <div class="date-group">
        <input v-model="inicio" @input="mascaraData('inicio')" placeholder="DD/MM/AAAA" maxlength="10" />
        <input v-model="fim" @input="mascaraData('fim')" placeholder="DD/MM/AAAA" maxlength="10" />
      </div>
      <div class="button-group">
        <button @click="filtrar" class="btn-filter">Filtrar</button>
        <button @click="exportarPDF">PDF</button>
        <button @click="exportarExcel">Excel</button>
      </div>
    </div>

    <div class="grid">
      <div class="card"><h3>Pedidos de Matrícula Pendentes</h3><div class="chart-container"><canvas ref="g1"></canvas></div></div>
      <div class="card"><h3>Matrículas Mensais</h3><div class="chart-container"><canvas ref="g2"></canvas></div></div>
      <div class="card"><h3>Receita Total por Semana</h3><div class="chart-container"><canvas ref="g3"></canvas></div></div>
      <div class="card"><h3>Receita Total por Mês</h3><div class="chart-container"><canvas ref="g4"></canvas></div></div>
      <div class="card"><h3>Receita Total por Ano</h3><div class="chart-container"><canvas ref="g5"></canvas></div></div>
      <div class="card"><h3>Receita Anual (Comparativo)</h3><div class="chart-container"><canvas ref="g6"></canvas></div></div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'
import api from '../api/api'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

const g1 = ref(), g2 = ref(), g3 = ref(), g4 = ref(), g5 = ref(), g6 = ref()
const charts = []

const inicio = ref('')
const fim = ref('')
const matriculas = ref([])
const financeiro = ref([])

const kpis = ref({
  receitaMes: 0,
  alunosAtivos: 0,
  inadimplentes: 0
})

/* =======================
   CACHE
======================= */
function cacheKey() {
  return `dashboard_${inicio.value || 'ALL'}_${fim.value || 'ALL'}`
}

function salvarCache(data) {
  localStorage.setItem(cacheKey(), JSON.stringify(data))
}

function carregarCache() {
  const c = localStorage.getItem(cacheKey())
  return c ? JSON.parse(c) : null
}

/* =======================
   DATA MASK
======================= */
function mascaraData(campo) {
  let v = campo === 'inicio' ? inicio.value : fim.value
  v = v.replace(/\D/g, '').slice(0, 8)
  if (v.length >= 5) v = `${v.slice(0,2)}/${v.slice(2,4)}/${v.slice(4)}`
  else if (v.length >= 3) v = `${v.slice(0,2)}/${v.slice(2)}`
  campo === 'inicio' ? inicio.value = v : fim.value = v
}

/* =======================
   LOAD DATA
======================= */
async function loadData() {
  const cache = carregarCache()
  if (cache) {
    matriculas.value = cache.matriculas
    financeiro.value = cache.financeiro
    return
  }

  const params = {}
  if (inicio.value) params.inicio = inicio.value
  if (fim.value) params.fim = fim.value

  try {
    const [m, f] = await Promise.all([
      api.get('/matriculas', { params }),
      api.get('/financeiro/fluxo', { params })
    ])

    matriculas.value = m.data
    financeiro.value = f.data
    salvarCache({ matriculas: m.data, financeiro: f.data })
  } catch (error) {
    console.error("Erro ao carregar dados:", error)
  }
}

/* =======================
   KPIs
======================= */
function calcularKPIs() {
  const mesAtual = new Date().getMonth()

  kpis.value.alunosAtivos = matriculas.value.filter(m => m.status === 'ATIVA').length
  kpis.value.inadimplentes = matriculas.value.filter(m => Number(m.valorMensalidade) === 0).length

  kpis.value.receitaMes = financeiro.value
    .filter(f => new Date(f.data).getMonth() === mesAtual)
    .reduce((s, f) => s + Number(f.valor), 0)
}

/* =======================
   BASE OPTIONS
======================= */
function baseOptions(prefix = '') {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#fff' }},
      tooltip: {
        callbacks: {
          label: ctx => `${prefix}${ctx.raw}`
        }
      }
    },
    scales: {
      x: { ticks: { color: '#fff' }},
      y: { ticks: { color: '#fff' }}
    }
  }
}

function destroyCharts() {
  charts.forEach(c => c.destroy())
  charts.length = 0
}

/* =======================
   GRÁFICOS
======================= */
function montarGraficos() {
  destroyCharts()

  /* 1 - Pizza */
  charts.push(new Chart(g1.value, {
    type: 'pie',
    data: {
      labels: ['Pendentes', 'Confirmadas'],
      datasets: [{
        data: [
          matriculas.value.filter(m => m.status !== 'ATIVA').length,
          matriculas.value.filter(m => m.status === 'ATIVA').length
        ],
        backgroundColor: ['crimson', 'limegreen']
      }]
    },
    options: { 
        responsive: true, 
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#fff' } } } 
    }
  }))

  /* 2 - Matrículas Mensais */
  const matMes = {}
  matriculas.value.forEach(m => {
    const dataRef = m.dataMatricula || m.createdAt
    const mes = new Date(dataRef).toLocaleString('pt-BR', { month: 'short' })
    matMes[mes] = (matMes[mes] || 0) + 1
  })

  charts.push(new Chart(g2.value, {
    type: 'line',
    data: {
      labels: Object.keys(matMes),
      datasets: [{
        label: 'Matrículas',
        data: Object.values(matMes),
        borderColor: 'limegreen',
        backgroundColor: 'rgba(0,255,0,0.2)',
        fill: true,
        tension: 0.4
      }]
    },
    options: baseOptions()
  }))

  gerarFinanceiro(g3.value, 'week', 'bar', 'dodgerblue', 'Receita por Semana')
  gerarFinanceiro(g4.value, 'month', 'bar', 'dodgerblue', 'Receita por Mês')
  gerarFinanceiro(g5.value, 'year', 'line', 'crimson', 'Receita por Ano', true)

  gerarComparativo()
}

function gerarFinanceiro(ref, tipo, chartType, cor, label, fill = false) {
  const map = {}

  financeiro.value.forEach(f => {
    const d = new Date(f.data)
    const key =
      tipo === 'week' ? `Semana ${Math.ceil(d.getDate() / 7)}` :
      tipo === 'month' ? d.toLocaleString('pt-BR', { month: 'short' }) :
      d.getFullYear()

    map[key] = (map[key] || 0) + Number(f.valor)
  })

  charts.push(new Chart(ref, {
    type: chartType,
    data: {
      labels: Object.keys(map),
      datasets: [{
        label,
        data: Object.values(map),
        borderColor: cor,
        backgroundColor: fill ? 'rgba(255,0,0,0.3)' : cor,
        fill,
        tension: 0.4
      }]
    },
    options: baseOptions('R$ ')
  }))
}

function gerarComparativo() {
  const anoAtual = new Date().getFullYear()
  let atual = 0
  let anterior = 0

  financeiro.value.forEach(f => {
    const ano = new Date(f.data).getFullYear()
    if (ano === anoAtual) atual += Number(f.valor)
    if (ano === anoAtual - 1) anterior += Number(f.valor)
  })

  charts.push(new Chart(g6.value, {
    type: 'bar',
    data: {
      labels: [anoAtual - 1, anoAtual],
      datasets: [{
        label: 'Receita',
        data: [anterior, atual],
        backgroundColor: ['crimson', 'dodgerblue']
      }]
    },
    options: baseOptions('R$ ')
  }))
}

function exportarPDF() {
  const pdf = new jsPDF('p', 'mm', 'a4')
  pdf.setFontSize(18)
  pdf.setTextColor(20, 27, 90)
  pdf.text('Relatório Financeiro Detalhado', 14, 20)
  
  pdf.setFontSize(11)
  pdf.setTextColor(0, 0, 0)
  pdf.text(`Data de Geração: ${new Date().toLocaleDateString('pt-BR')}`, 14, 30)
  pdf.text(`Filtro: ${inicio.value || 'Início'} até ${fim.value || 'Fim'}`, 14, 35)
  
  pdf.setFont("helvetica", "bold")
  pdf.text(`Receita Total do Mês: R$ ${kpis.value.receitaMes.toFixed(2)}`, 14, 45)
  pdf.text(`Alunos Ativos: ${kpis.value.alunosAtivos}`, 14, 50)
  pdf.text(`Inadimplência detectada: ${kpis.value.inadimplentes}`, 14, 55)

  autoTable(pdf, {
    startY: 65,
    head: [['Data', 'Descrição / Aluno', 'Valor (R$)']],
    body: financeiro.value.map(f => [
      new Date(f.data).toLocaleDateString('pt-BR'),
      f.descricao || 'Pagamento de Mensalidade',
      `R$ ${Number(f.valor).toFixed(2)}`
    ]),
    headStyles: { fillColor: [31, 42, 122] },
    theme: 'striped',
    styles: { fontSize: 10 }
  })

  pdf.save(`relatorio_financeiro_${new Date().getTime()}.pdf`)
}

function exportarExcel() {
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(financeiro.value), 'Financeiro')
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(matriculas.value), 'Matrículas')
  XLSX.writeFile(wb, 'Relatorio_Dashboard.xlsx')
}

async function filtrar() {
  await loadData()
  calcularKPIs()
  montarGraficos()
}

onMounted(async () => {
  await loadData()
  calcularKPIs()
  montarGraficos()
})
</script>

<style scoped>
.dashboard {
  background: #0d124a;
  min-height: 100vh;
  padding: 20px;
  color: #fff;
}

/* KPIs */
.kpis {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap; /* Permite quebrar linha em telas pequenas */
}
.kpi {
  background: #141b5a;
  flex: 1;
  min-width: 200px; /* Garante que não fiquem muito estreitos */
  padding: 20px;
  border-radius: 12px;
  text-align: center;
}
.kpi strong {
  display: block;
  font-size: 1.4rem;
  margin-top: 5px;
  color: #4ade80;
}

/* Filtros */
.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.date-group {
  display: flex;
  gap: 10px;
  flex: 1;
}
.date-group input {
  flex: 1;
  padding: 10px;
  border-radius: 6px;
  border: none;
  background: #141b5a;
  color: #fff;
  min-width: 120px;
}
.button-group {
  display: flex;
  gap: 8px;
}
.filters button {
  padding: 10px 15px;
  border-radius: 6px;
  border: none;
  background: #1f2a7a;
  color: #fff;
  cursor: pointer;
  font-weight: bold;
  white-space: nowrap;
}
.filters button.btn-filter {
  background: #ff3c78;
}
.filters button:hover {
  opacity: 0.8;
}

/* Grid de Gráficos */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}
.card {
  background: #141b5a;
  padding: 20px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
}
.card h3 {
  margin-bottom: 15px;
  font-size: 1rem;
  color: #a5b4fc;
}
.chart-container {
  position: relative;
  height: 250px; /* Altura fixa para manter consistência */
  width: 100%;
}

/* Responsividade adicional para celulares pequenos */
@media (max-width: 600px) {
  .dashboard { padding: 10px; }
  .kpis { gap: 10px; }
  .kpi { padding: 15px; }
  .date-group { width: 100%; }
  .button-group { width: 100%; justify-content: space-between; }
  .button-group button { flex: 1; }
  .grid { grid-template-columns: 1fr; }
}
</style>