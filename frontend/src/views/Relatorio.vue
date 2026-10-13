<template>
  <div class="container">
    <header class="header">
      <h1><i class="fas fa-chart-line"></i> Relatório Financeiro Completo</h1>
    </header>

    <div class="filters-card">
      <div class="filters">
        <div class="date-inputs">
          <div class="input-group">
            <label>Início:</label>
            <input 
              type="text" 
              v-model="filters.start" 
              placeholder="DD/MM/AAAA" 
              maxlength="10"
              @input="formatarDataInput('start')"
            />
          </div>
          <span class="divider">até</span>
          <div class="input-group">
            <label>Fim:</label>
            <input 
              type="text" 
              v-model="filters.end" 
              placeholder="DD/MM/AAAA" 
              maxlength="10"
              @input="formatarDataInput('end')"
            />
          </div>
        </div>
        <div class="filter-actions">
          <button @click="applyFilters" class="btn btn-primary">
            <i class="fas fa-filter"></i> Filtrar
          </button>
          <button @click="resetFilters" class="btn btn-secondary">
            <i class="fas fa-undo"></i> Resetar
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading">Carregando relatório...</div>

    <div v-else class="summary-wrapper">
      <div class="summary-grid">
        <button class="summary-item receita" @click="filterByType('Receita')">
          <span>Receita Total</span>
          <strong>{{ formatCurrency(totalReceita) }}</strong>
        </button>
        <button class="summary-item despesa" @click="filterByType('Despesa')">
          <span>Despesa Total</span>
          <strong>{{ formatCurrency(totalDespesa) }}</strong>
        </button>
        <button class="summary-item saldo" @click="resetFilters">
          <span>Saldo Final</span>
          <strong>{{ formatCurrency(saldoFinal) }}</strong>
        </button>
      </div>
      <button class="btn-export btn-success" @click="exportPDF">
        <i class="fas fa-file-pdf"></i> Exportar PDF
      </button>
    </div>

    <div v-if="!loading" class="report-table card">
      <h2>Movimentações</h2>
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Tipo</th>
              <th>Descrição</th>
              <th>Entidade</th>
              <th>Valor (R$)</th>
              <th>Saldo Parcial (R$)</th>
              <th>Nota Fiscal</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(entry, index) in filteredEntries"
              :key="index"
              :class="entry.type==='Receita' ? 'row-receita' : 'row-despesa'"
            >
              <td class="nowrap">{{ formatDate(entry.date) }}</td>
              <td>{{ entry.type }}</td>
              <td>{{ entry.description }}</td>
              <td>{{ entry.entity }}</td>
              <td :class="{'credit': entry.type==='Receita', 'debit': entry.type==='Despesa'}" class="nowrap">
                {{ formatCurrency(entry.value) }}
              </td>
              <td class="nowrap">{{ formatCurrency(calculatePartialBalance(index)) }}</td>
              <td>
                <button @click="emitirNotaFiscal(entry)" class="btn btn-nf">
                  <i class="fas fa-file-invoice"></i> NF
                </button>
              </td>
            </tr>
            <tr v-if="filteredEntries.length === 0">
              <td colspan="7" class="empty">Nenhuma movimentação encontrada</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showNFModal" class="modal" @click.self="showNFModal=false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Emitir Nota Fiscal</h3>
          <span class="close-modal" @click="showNFModal=false">&times;</span>
        </div>
        <div class="modal-body">
          <label>Tipo:</label>
          <select v-model="nf.tipo">
            <option value="PF">Pessoa Física (CPF)</option>
            <option value="PJ">Pessoa Jurídica (CNPJ)</option>
          </select>
          <label v-if="nf.tipo==='PF'">CPF:</label>
          <input v-if="nf.tipo==='PF'" type="text" v-model="nf.cpf" placeholder="000.000.000-00"/>
          <label v-if="nf.tipo==='PJ'">CNPJ:</label>
          <input v-if="nf.tipo==='PJ'" type="text" v-model="nf.cnpj" placeholder="00.000.000/0000-00"/>
          <label>Descrição:</label>
          <input type="text" v-model="nf.description"/>
          <label>Valor:</label>
          <input type="number" v-model="nf.value" step="0.01"/>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showNFModal=false">Cancelar</button>
          <button class="btn btn-primary" @click="gerarNF()">Emitir Nota Fiscal</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import api from '../api/api.js';

export default {
  name: "Relatorio",
  data() {
    return {
      filters: { start: "", end: "" },
      entries: [],
      filteredEntries: [],
      loading: true,
      showNFModal: false,
      nf: { tipo: "PF", cpf: "", cnpj: "", description: "", value: 0 },
    };
  },
  computed: {
    totalReceita() { 
      return this.filteredEntries.filter(e => e.type === "Receita").reduce((sum, e) => sum + e.value, 0); 
    },
    totalDespesa() { 
      return this.filteredEntries.filter(e => e.type === "Despesa").reduce((sum, e) => sum + e.value, 0); 
    },
    saldoFinal() { 
      return this.totalReceita - this.totalDespesa; 
    }
  },
  methods: {
    formatCurrency(value) { return `R$ ${value.toFixed(2)}`; },
    formatDate(date) { return new Date(date).toLocaleDateString("pt-BR"); },
    
    // Máscara de Data Brasileira DD/MM/AAAA
    formatarDataInput(field) {
      let val = this.filters[field].replace(/\D/g, ""); // Remove tudo que não é dígito
      if (val.length > 8) val = val.slice(0, 8); // Garante o limite de 8 dígitos

      if (val.length >= 5) {
        val = `${val.slice(0, 2)}/${val.slice(2, 4)}/${val.slice(4)}`;
      } else if (val.length >= 3) {
        val = `${val.slice(0, 2)}/${val.slice(2)}`;
      }
      this.filters[field] = val;
    },

    // Converte DD/MM/AAAA para Objeto Date seguro
    parseBrazilianDate(dateStr) {
      if (!dateStr || dateStr.length < 10) return null;
      const [day, month, year] = dateStr.split("/");
      return new Date(year, month - 1, day);
    },

    calculatePartialBalance(index) {
      let balance = 0;
      for (let i = 0; i <= index; i++) {
        balance += this.filteredEntries[i].type === "Receita" ? this.filteredEntries[i].value : -this.filteredEntries[i].value;
      }
      return balance;
    },
    async loadRelatorio() {
      this.loading = true;
      try {
        const res = await api.get('/relatorios');
        this.entries = res.data || [];
        this.filteredEntries = [...this.entries];
      } catch (e) {
        console.error('Erro ao carregar dados do relatório:', e);
      } finally {
        this.loading = false;
      }
    },
    applyFilters() {
      const start = this.parseBrazilianDate(this.filters.start);
      const end = this.parseBrazilianDate(this.filters.end);
      
      this.filteredEntries = this.entries.filter(entry => {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0); // Normaliza para comparação

        if (start) {
          start.setHours(0, 0, 0, 0);
          if (entryDate < start) return false;
        }
        if (end) {
          end.setHours(0, 0, 0, 0);
          if (entryDate > end) return false;
        }
        return true;
      });
    },
    resetFilters() {
      this.filters.start = "";
      this.filters.end = "";
      this.filteredEntries = [...this.entries];
    },
    filterByType(tipo) {
      this.filteredEntries = this.entries.filter(e => e.type === tipo);
    },
    exportPDF() {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Relatório Financeiro - Escola de Dança", 14, 15);

      autoTable(doc, {
        startY: 25,
        head: [["Data","Tipo","Descrição","Entidade","Valor","Saldo Parcial"]],
        headStyles: { fillColor: [74, 21, 75], textColor: 255 },
        body: this.filteredEntries.map((e, i) => [
          this.formatDate(e.date),
          e.type,
          e.description,
          e.entity,
          this.formatCurrency(e.value),
          this.formatCurrency(this.calculatePartialBalance(i))
        ])
      });

      doc.save("relatorio_financeiro.pdf");
    },
    emitirNotaFiscal(entry) {
      this.nf.description = entry.description;
      this.nf.value = entry.value;
      this.showNFModal = true;
    },
    gerarNF() {
      const tipo = this.nf.tipo;
      const id = tipo === "PF" ? this.nf.cpf : this.nf.cnpj;
      if (!id || !this.nf.description || !this.nf.value) {
        alert("Preencha todos os campos corretamente!");
        return;
      }
      const doc = new jsPDF();
      const dataHora = new Date().toLocaleString("pt-BR");

      doc.setFontSize(20);
      doc.setTextColor(74,21,75);
      doc.text("ESCOLA DE DANÇA - NOTA FISCAL", 14, 20);
      doc.setDrawColor(74,21,75);
      doc.setLineWidth(0.5);
      doc.rect(10, 25, 190, 100);
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text(`Data/Hora: ${dataHora}`, 14, 35);
      doc.text(`Tipo: ${tipo === "PF" ? "Pessoa Física" : "Pessoa Jurídica"}`, 14, 45);
      doc.text(`ID: ${id}`, 14, 55);
      doc.text(`Descrição: ${this.nf.description}`, 14, 65);
      doc.text(`Valor: R$ ${this.nf.value.toFixed(2)}`, 14, 75);
      doc.save(`nota_fiscal_${tipo}_${id}.pdf`);

      this.showNFModal = false;
      alert("Nota Fiscal emitida com sucesso!");
    }
  },
  mounted() {
    this.loadRelatorio();
  }
};
</script>

<style scoped>
.container { 
  padding: 20px; 
  background-color: #1f1f1f; 
  color: #f0f0f0;
  min-height: 100vh;
}
.header { 
  margin-bottom: 20px; 
  color: #e0aaff; 
  text-align: center;
}
.header h1 {
  font-size: clamp(1.2rem, 4vw, 2rem);
}

/* FILTROS RESPONSIVOS */
.filters-card { 
  background: #2c2c2c; 
  padding: 15px 20px; 
  border-radius: 8px; 
  box-shadow: 0 2px 8px rgba(0,0,0,0.5); 
  margin-bottom: 20px; 
}
.filters { 
  display: flex; 
  flex-direction: row; 
  justify-content: space-between; 
  align-items: center; 
  gap: 15px;
  flex-wrap: wrap; 
}
.date-inputs {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.input-group {
  display: flex;
  flex-direction: column;
}
.input-group label {
  font-size: 0.8rem;
  margin-bottom: 4px;
  color: #aaa;
}
.filters input { 
  padding: 10px 12px; 
  border-radius: 6px; 
  border: 1px solid #555; 
  background: #333; 
  color: #fff; 
  width: 140px;
  outline: none;
}
.filters input:focus {
  border-color: #6a1b9a;
}
.filter-actions {
  display: flex;
  gap: 10px;
}

/* RESUMO FINANCEIRO RESPONSIVO */
.summary-wrapper {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}
.summary-item { 
  padding: 15px; 
  border-radius: 6px; 
  color: white; 
  text-align: center; 
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 5px;
  transition: transform 0.2s;
}
.summary-item:hover { transform: scale(1.02); }
.summary-item span { font-size: 0.9rem; font-weight: normal; }
.summary-item strong { font-size: 1.1rem; }

.summary-item.receita { background-color: #2f855a; }
.summary-item.despesa { background-color: #c53030; }
.summary-item.saldo { background-color: #2b6cb0; }

.btn {
  padding: 10px 15px; 
  border-radius: 6px; 
  cursor: pointer; 
  border: none;
  font-weight: bold;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.btn-primary { background-color: #6a1b9a; color: white; }
.btn-secondary { background-color: #555; color: white; }
.btn-success { background-color: #2f855a; color: white; width: 100%; }
.btn-nf { background-color: #d69e2e; color: #fff; padding: 6px 10px; font-size: 0.8rem; }

/* TABELA RESPONSIVA */
.report-table.card { background: #2c2c2c; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.5); }
.table-responsive { overflow-x: auto; -webkit-overflow-scrolling: touch; }
.report-table table { width: 100%; border-collapse: collapse; min-width: 700px; }
.report-table th { padding: 12px 10px; color: #e0aaff; text-align: left; background: #333; }
.report-table td { padding: 12px 10px; border-bottom: 1px solid #444; font-size: 0.9rem; }
.nowrap { white-space: nowrap; }

.row-receita { background-color: rgba(47, 133, 90, 0.1); }
.row-despesa { background-color: rgba(197, 48, 48, 0.1); }
.credit { color: #48bb78; font-weight: bold; }
.debit { color: #f56565; font-weight: bold; }

/* MODAL RESPONSIVO */
.modal { position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.85); display:flex; align-items:center; justify-content:center; z-index: 2000; padding: 15px; }
.modal-content { background: #2c2c2c; padding:20px; border-radius:8px; width:100%; max-width:450px; box-shadow: 0 0 20px rgba(0,0,0,0.8); }
.modal-body label { display: block; margin-top: 10px; color: #aaa; font-size: 0.85rem; }
.modal-body input, .modal-body select { width:100%; margin-top:5px; padding:10px; border-radius:4px; border:1px solid #555; background: #1f1f1f; color: #fff; }

/* --- MEDIA QUERIES --- */
@media (max-width: 768px) {
  .filters { flex-direction: column; align-items: stretch; }
  .date-inputs { justify-content: space-between; }
  .filters input { flex: 1; width: auto; }
  .filter-actions { display: grid; grid-template-columns: 1fr 1fr; }
  .summary-grid { grid-template-columns: 1fr; } 
}

@media (max-width: 480px) {
  .date-inputs { flex-direction: column; align-items: stretch; }
  .divider { text-align: center; display: block; margin: 5px 0; }
  .container { padding: 10px; }
  .header h1 { font-size: 1.2rem; }
  .report-table.card { padding: 10px; }
}
</style>