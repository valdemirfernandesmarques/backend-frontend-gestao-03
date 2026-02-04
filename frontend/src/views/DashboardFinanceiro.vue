<template>
  <div class="dashboard-financeiro">
    <h1 class="titulo">Isenção da Taxa da Plataforma (1,3%)</h1>

    <div class="card-dark">
      <h2>Criar Isenção</h2>

      <form @submit.prevent="criarIsencao" class="form-dark">
        <div class="form-group">
          <label>Escola</label>
          <select v-model="form.escolaId">
            <option :value="null">Todas as escolas (Global)</option>
            <option v-for="e in escolas" :key="e.id" :value="e.id">
              {{ e.nome }}
            </option>
          </select>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Data início *</label>
            <input
              type="text"
              v-model="form.dataInicio"
              placeholder="DD/MM/AAAA"
              maxlength="10"
              @input="mascaraData('dataInicio')"
            />
          </div>

          <div class="form-group">
            <label>Data fim</label>
            <input
              type="text"
              v-model="form.dataFim"
              placeholder="DD/MM/AAAA"
              maxlength="10"
              @input="mascaraData('dataFim')"
            />
          </div>
        </div>

        <div class="form-group">
          <label>Motivo</label>
          <input type="text" v-model="form.motivo" placeholder="Ex: Parceria promocional" />
        </div>

        <button class="btn-primary" type="submit">Criar Isenção</button>
      </form>
    </div>

    <div class="card-dark">
      <h2>Isenções Cadastradas</h2>
      <div class="table-wrapper">
        <table class="table-dark">
          <thead>
            <tr>
              <th>Escola</th>
              <th>Início</th>
              <th>Fim</th>
              <th>Status</th>
              <th>Motivo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in isencoes" :key="i.id">
              <td>{{ i.escola ? i.escola.nome : 'Global' }}</td>
              <td>{{ formatarData(i.dataInicio) }}</td>
              <td>{{ i.dataFim ? formatarData(i.dataFim) : '-' }}</td>
              <td>
                <span :class="i.ativo ? 'status-ativo' : 'status-inativo'">
                  {{ i.ativo ? 'Ativa' : 'Inativa' }}
                </span>
              </td>
              <td>{{ i.motivo || '-' }}</td>
              <td>
                <button class="btn-secondary btn-table" @click="alterarStatus(i)">
                  {{ i.ativo ? 'Desativar' : 'Ativar' }}
                </button>
              </td>
            </tr>
            <tr v-if="isencoes.length === 0">
              <td colspan="6" class="text-center">Nenhuma isenção encontrada</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="grid-footer">
        <div class="card-dark">
          <h2>Estorno de Transação</h2>
          <div class="form-inline">
            <input
              type="text"
              v-model="estorno.transacaoId"
              placeholder="ID da Transação"
            />
            <button class="btn-secondary" @click="realizarEstorno">
              Estornar
            </button>
          </div>
        </div>

        <div class="card-dark export-card">
          <h2>Exportação</h2>
          <button class="btn-primary w-full" @click="exportarCSV">
            <i class="fas fa-download"></i> Exportar CSV Financeiro
          </button>
        </div>
    </div>

    <div class="cards-resumo">
      <div class="card-resumo-item">
        <h2>Total de Isenções</h2>
        <p>{{ resumo.isencoes || 0 }}</p>
      </div>
      <div class="card-resumo-item">
        <h2>Total de Entradas</h2>
        <p class="text-green">{{ formatCurrency(resumo.entradas || 0) }}</p>
      </div>
      <div class="card-resumo-item">
        <h2>Total de Saídas</h2>
        <p class="text-red">{{ formatCurrency(resumo.saidas || 0) }}</p>
      </div>
      <div class="card-resumo-item">
        <h2>Saldo Atual</h2>
        <p :class="resumo.saldo >= 0 ? 'text-blue' : 'text-red'">{{ formatCurrency(resumo.saldo || 0) }}</p>
      </div>
    </div>

    <div class="card-dark">
      <h2>Gráfico Mensal (Simples)</h2>
      <div class="grafico-container">
          <div class="grafico-simples">
            <div
              v-for="(v, i) in graficoValores"
              :key="i"
              class="barra-wrapper"
            >
              <div class="barra" :style="{ height: v + '%' }">
                <span class="v-label">{{ v }}%</span>
              </div>
              <span class="m-label">Mês {{ i + 1 }}</span>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/api";

export default {
  name: "DashboardFinanceiro",
  data() {
    return {
      escolas: [],
      isencoes: [],
      resumo: { isencoes: 0, entradas: 0, saidas: 0, saldo: 0 },
      form: { escolaId: null, dataInicio: "", dataFim: "", motivo: "" },
      estorno: { transacaoId: "" },
      graficoValores: [30, 50, 70, 40, 90],
    };
  },
  mounted() {
    this.carregarEscolas();
    this.carregarIsencoes();
    this.carregarResumo();
  },
  methods: {
    formatarData(data) {
      return data ? new Date(data).toLocaleDateString("pt-BR") : "-";
    },
    formatCurrency(valor) {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(valor);
    },
    mascaraData(campo) {
      let v = this.form[campo].replace(/\D/g, "");
      if (v.length > 8) v = v.slice(0, 8);
      if (v.length >= 5) v = v.replace(/^(\d{2})(\d{2})(\d{0,4})$/, "$1/$2/$3");
      else if (v.length >= 3) v = v.replace(/^(\d{2})(\d{0,2})$/, "$1/$2");
      this.form[campo] = v;
    },
    paraISO(data) {
      const [d, m, a] = data.split("/");
      return `${a}-${m}-${d}`;
    },

    async carregarEscolas() {
      try {
        const res = await api.get("/escolas");
        this.escolas = res.data || [];
      } catch (err) {
        console.error("Erro ao carregar escolas:", err);
      }
    },

    async carregarIsencoes() {
      try {
        const res = await api.get("/isencao-taxa");
        this.isencoes = res.data || [];
      } catch (err) {
        console.error("Erro ao carregar isenções:", err);
      }
    },

    async criarIsencao() {
      if (!this.form.dataInicio) {
        alert("Informe a data de início");
        return;
      }
      try {
        await api.post("/isencao-taxa", {
          escolaId: this.form.escolaId,
          dataInicio: this.paraISO(this.form.dataInicio),
          dataFim: this.form.dataFim ? this.paraISO(this.form.dataFim) : null,
          motivo: this.form.motivo,
        });
        this.form = { escolaId: null, dataInicio: "", dataFim: "", motivo: "" };
        this.carregarIsencoes();
        this.carregarResumo();
      } catch (err) {
        console.error("Erro ao criar isenção:", err);
      }
    },

    async alterarStatus(isencao) {
      try {
        await api.put(`/isencao-taxa/${isencao.id}/status`, {
          ativo: !isencao.ativo,
        });
        this.carregarIsencoes();
        this.carregarResumo();
      } catch (err) {
        console.error("Erro ao alterar status:", err);
      }
    },

    async realizarEstorno() {
      if (!this.estorno.transacaoId) {
        alert("Informe o ID da transação");
        return;
      }
      try {
        await api.post("/transacoes-financeiras/estorno", {
          transacaoId: this.estorno.transacaoId,
        });
        alert("Estorno realizado com sucesso");
        this.estorno.transacaoId = "";
        this.carregarResumo();
      } catch (err) {
        console.error("Erro ao realizar estorno:", err);
        alert("Erro ao realizar estorno");
      }
    },

    async exportarCSV() {
      try {
        const res = await api.get("/super/transacoes-financeiras/exportar-csv", {
          responseType: "blob",
        });
        const url = window.URL.createObjectURL(new Blob([res.data], { type: "text/csv" }));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "transacoes_financeiras.csv");
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (err) {
        console.error("Erro ao exportar CSV:", err);
        alert("Erro ao exportar CSV");
      }
    },

    async carregarResumo() {
      try {
        const res = await api.get("/super/transacoes-financeiras/resumo");
        this.resumo = res.data || { isencoes: 0, entradas: 0, saidas: 0, saldo: 0 };
      } catch (err) {
        console.error("Erro ao carregar resumo:", err);
      }
    },
  },
};
</script>

<style scoped>
.dashboard-financeiro {
  padding: 20px;
  color: #f1f1f1;
  max-width: 1400px;
  margin: 0 auto;
}

.titulo {
  font-size: 1.5rem;
  margin-bottom: 25px;
  color: #6c4cff;
}

.card-dark {
  background: #1f1b2e;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 25px;
  border: 1px solid #2d2740;
}

.card-dark h2 {
  font-size: 1.1rem;
  margin-bottom: 20px;
  color: #a5b4fc;
}

/* FORMULÁRIOS */
.form-dark {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 0.85rem;
  color: #94a3b8;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.form-inline {
  display: flex;
  gap: 10px;
}

.form-inline input {
  flex: 1;
}

input,
select {
  background: #2c2740;
  border: 1px solid #444;
  color: #fff;
  padding: 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  outline: none;
}

input:focus, select:focus {
  border-color: #6c4cff;
}

.btn-primary {
  background: #6c4cff;
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-secondary {
  background: #334155;
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
}

.btn-table {
  padding: 6px 12px;
  font-size: 0.8rem;
}

.btn-primary:hover, .btn-secondary:hover {
  opacity: 0.8;
}

.w-full { width: 100%; }

/* TABELA */
.table-wrapper {
  overflow-x: auto;
}

.table-dark {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}

.table-dark th {
  text-align: left;
  font-size: 0.85rem;
  color: #94a3b8;
  padding: 12px;
  background: #26213b;
}

.table-dark td {
  padding: 12px;
  border-bottom: 1px solid #2d2740;
  font-size: 0.9rem;
}

.status-ativo { color: #4caf50; font-weight: bold; }
.status-inativo { color: #ff6b6b; font-weight: bold; }

/* LAYOUT RODAPÉ */
.grid-footer {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 25px;
}

/* CARDS RESUMO */
.cards-resumo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 25px;
}

.card-resumo-item {
  background: #1f1b2e;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  border-left: 4px solid #6c4cff;
}

.card-resumo-item h2 {
  font-size: 0.9rem;
  color: #94a3b8;
  margin-bottom: 10px;
}

.card-resumo-item p {
  font-size: 1.5rem;
  font-weight: bold;
}

.text-green { color: #4caf50; }
.text-red { color: #ff6b6b; }
.text-blue { color: #3b82f6; }

/* GRÁFICO */
.grafico-container {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 10px;
}

.grafico-simples {
  display: flex;
  gap: 20px;
  align-items: flex-end;
  height: 200px;
  min-width: 400px;
  padding-top: 20px;
}

.barra-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: flex-end;
}

.barra {
  width: 100%;
  max-width: 50px;
  background: linear-gradient(to top, #6c4cff, #a78bfa);
  border-radius: 4px 4px 0 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  transition: height 0.5s ease;
  position: relative;
}

.v-label {
  font-size: 0.7rem;
  margin-top: -20px;
  color: #fff;
}

.m-label {
  margin-top: 10px;
  font-size: 0.75rem;
  color: #94a3b8;
}

/* --- RESPONSIVIDADE --- */

@media (max-width: 1024px) {
  .grid-footer {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-inline {
    flex-direction: column;
  }
  
  .form-inline button {
    width: 100%;
  }

  .titulo {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .dashboard-financeiro {
    padding: 10px;
  }
  
  .card-dark {
    padding: 15px;
  }
}
</style>