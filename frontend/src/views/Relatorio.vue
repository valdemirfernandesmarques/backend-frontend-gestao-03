<template>
  <AdminEscolaLayout>
    <div class="container">
      <header class="header">
        <h1><i class="fas fa-chart-line"></i> Relatório Financeiro Completo</h1>
      </header>

      <!-- Filtros -->
      <div class="filters">
        <label>Período:</label>
        <input type="date" v-model="filters.start" />
        <span>até</span>
        <input type="date" v-model="filters.end" />
        <button @click="applyFilters" class="btn btn-primary">
          <i class="fas fa-filter"></i> Filtrar
        </button>
      </div>

      <!-- Tabela de Movimentações -->
      <div class="report-table">
        <h2>Movimentações</h2>
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Tipo</th>
              <th>Descrição</th>
              <th>Aluno/Funcionário/Produto</th>
              <th>Valor (R$)</th>
              <th>Saldo Parcial (R$)</th>
              <th>Nota Fiscal</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(entry, index) in filteredEntries" :key="index">
              <td>{{ formatDate(entry.date) }}</td>
              <td>{{ entry.type }}</td>
              <td>{{ entry.description }}</td>
              <td>{{ entry.entity }}</td>
              <td :class="{'credit': entry.type==='Receita', 'debit': entry.type==='Despesa'}">
                {{ formatCurrency(entry.value) }}
              </td>
              <td>{{ formatCurrency(calculatePartialBalance(index)) }}</td>
              <td>
                <button @click="emitirNotaFiscal(entry)" class="btn btn-secondary">
                  <i class="fas fa-file-invoice"></i> NF
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Resumo -->
      <div class="summary">
        <h2>Resumo Financeiro</h2>
        <p>Receita Total: <strong>{{ formatCurrency(totalReceita) }}</strong></p>
        <p>Despesa Total: <strong>{{ formatCurrency(totalDespesa) }}</strong></p>
        <p>Saldo Final: <strong>{{ formatCurrency(saldoFinal) }}</strong></p>
        <button @click="exportPDF" class="btn btn-success">
          <i class="fas fa-file-pdf"></i> Exportar PDF
        </button>
      </div>
    </div>

    <!-- Modal Nota Fiscal -->
    <div v-if="showNFModal" class="modal">
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
  </AdminEscolaLayout>
</template>

<script>
import jsPDF from "jspdf";
import "jspdf-autotable";

export default {
  name: "Relatorio",
  data() {
    return {
      filters: {
        start: "",
        end: "",
      },
      entries: [
        // Exemplos iniciais
        { date: "2025-10-01", type: "Receita", description: "Mensalidade Aluno", entity: "João Silva", value: 150 },
        { date: "2025-10-02", type: "Despesa", description: "Salário Professor", entity: "Ana Souza", value: 800 },
        { date: "2025-10-03", type: "Receita", description: "Venda Camiseta", entity: "Produto", value: 35 },
        { date: "2025-10-04", type: "Despesa", description: "Comissão Professor", entity: "Carlos Lima", value: 120 }
      ],
      filteredEntries: [],
      showNFModal: false,
      nf: {
        tipo: "PF",
        cpf: "",
        cnpj: "",
        description: "",
        value: 0,
      }
    };
  },
  computed: {
    totalReceita() {
      return this.filteredEntries
        .filter(e => e.type === "Receita")
        .reduce((sum, e) => sum + e.value, 0);
    },
    totalDespesa() {
      return this.filteredEntries
        .filter(e => e.type === "Despesa")
        .reduce((sum, e) => sum + e.value, 0);
    },
    saldoFinal() {
      return this.totalReceita - this.totalDespesa;
    }
  },
  methods: {
    formatCurrency(value) {
      return `R$ ${value.toFixed(2)}`;
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString("pt-BR");
    },
    calculatePartialBalance(index) {
      let balance = 0;
      for (let i = 0; i <= index; i++) {
        balance += this.filteredEntries[i].type === "Receita"
          ? this.filteredEntries[i].value
          : -this.filteredEntries[i].value;
      }
      return balance;
    },
    applyFilters() {
      const start = this.filters.start ? new Date(this.filters.start) : null;
      const end = this.filters.end ? new Date(this.filters.end) : null;

      this.filteredEntries = this.entries.filter(entry => {
        const date = new Date(entry.date);
        if (start && date < start) return false;
        if (end && date > end) return false;
        return true;
      });
    },
    exportPDF() {
      const doc = new jsPDF();
      doc.text("Relatório Financeiro - Escola de Dança", 14, 15);
      doc.autoTable({
        startY: 25,
        head: [["Data","Tipo","Descrição","Entidade","Valor","Saldo Parcial"]],
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
      doc.setFontSize(16);
      doc.text("Nota Fiscal", 14, 20);
      doc.setFontSize(12);
      doc.text(`Tipo: ${tipo === "PF" ? "Pessoa Física" : "Pessoa Jurídica"}`, 14, 30);
      doc.text(`ID: ${id}`, 14, 40);
      doc.text(`Descrição: ${this.nf.description}`, 14, 50);
      doc.text(`Valor: R$ ${this.nf.value.toFixed(2)}`, 14, 60);
      doc.save(`nota_fiscal_${tipo}_${id}.pdf`);

      this.showNFModal = false;
      alert("Nota Fiscal emitida com sucesso!");
    }
  },
  mounted() {
    this.applyFilters();
  }
};
</script>

<style scoped>
.container {
  padding: 20px;
}
.header {
  margin-bottom: 20px;
  color: #4a154b;
}
.filters {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}
.filters input {
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
.filters button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background-color: #4a154b;
  color: white;
  cursor: pointer;
}
.report-table table {
  width: 100%;
  border-collapse: collapse;
}
.report-table th, .report-table td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}
.credit {
  color: green;
}
.debit {
  color: red;
}
.summary {
  margin-top: 20px;
}
.summary p {
  font-size: 16px;
}
.btn {
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}
.btn-primary { background-color: #4a154b; color: white; }
.btn-success { background-color: #48bb78; color: white; }
.btn-secondary { background-color: #a0aec0; color: white; }
.modal {
  position: fixed;
  top: 0;
  left:0;
  width:100%;
  height:100%;
  background: rgba(0,0,0,0.5);
  display:flex;
  align-items:center;
  justify-content:center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding:20px;
  border-radius:8px;
  width:400px;
  max-width:90%;
}
.modal-header {
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:15px;
}
.close-modal {
  cursor:pointer;
  font-size:20px;
}
.modal-body input, .modal-body select {
  width:100%;
  margin-bottom:10px;
  padding:5px;
  border-radius:4px;
  border:1px solid #ccc;
}
.modal-footer {
  display:flex;
  justify-content:flex-end;
  gap:10px;
}
</style>
