<template>
  <div class="dashboard-financeiro">
    <h1 class="titulo">Isenção da Taxa da Plataforma (1,3%)</h1>

    <!-- ================= CARD CRIAR ISENÇÃO ================= -->
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
          <input type="text" v-model="form.motivo" />
        </div>

        <button class="btn-primary" type="submit">Criar Isenção</button>
      </form>
    </div>

    <!-- ================= LISTAGEM ISENÇÕES ================= -->
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
                <button class="btn-secondary" @click="alterarStatus(i)">
                  {{ i.ativo ? 'Desativar' : 'Ativar' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ================= CARD ESTORNO ================= -->
    <div class="card-dark">
      <h2>Estorno de Transação</h2>
      <div class="form-row">
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

    <!-- ================= CARD CSV ================= -->
    <div class="card-dark">
      <h2>Exportação Financeira</h2>
      <button class="btn-primary" @click="exportarCSV">Exportar CSV</button>
    </div>

    <!-- ================= CARDS RESUMO ================= -->
    <div class="cards-resumo">
      <div class="card-dark">
        <h2>Total de Isenções</h2>
        <p>{{ resumo.isencoes || 0 }}</p>
      </div>
      <div class="card-dark">
        <h2>Total de Entradas</h2>
        <p>{{ formatCurrency(resumo.entradas || 0) }}</p>
      </div>
      <div class="card-dark">
        <h2>Total de Saídas</h2>
        <p>{{ formatCurrency(resumo.saidas || 0) }}</p>
      </div>
      <div class="card-dark">
        <h2>Saldo</h2>
        <p>{{ formatCurrency(resumo.saldo || 0) }}</p>
      </div>
    </div>

    <!-- ================= CARD GRÁFICO ================= -->
    <div class="card-dark">
      <h2>Gráfico Mensal (Simples)</h2>
      <div class="grafico-simples">
        <div
          v-for="(v, i) in graficoValores"
          :key="i"
          class="barra"
          :style="{ height: v + '%' }"
        >
          {{ v }}%
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
  padding: 24px;
  color: #f1f1f1;
}

.card-dark {
  background: #1f1b2e;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
}

.form-row {
  display: flex;
  gap: 12px;
}

input,
select {
  background: #2c2740;
  border: 1px solid #444;
  color: #fff;
  padding: 10px;
  border-radius: 6px;
}

.btn-primary {
  background: #6c4cff;
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 8px;
}

.btn-secondary {
  background: #444;
  color: #fff;
  border: none;
  padding: 10px;
  border-radius: 6px;
}

.table-dark {
  width: 100%;
  border-collapse: collapse;
}

.table-dark th,
.table-dark td {
  padding: 12px;
  border-bottom: 1px solid #333;
}

.status-ativo {
  color: #4caf50;
}

.status-inativo {
  color: #ff6b6b;
}

/* CARDS RESUMO */
.cards-resumo {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

/* GRÁFICO SIMPLES */
.grafico-simples {
  display: flex;
  gap: 10px;
  align-items: flex-end;
  height: 150px;
}

.barra {
  width: 40px;
  background: #6c4cff;
  text-align: center;
  font-size: 12px;
}
</style>
