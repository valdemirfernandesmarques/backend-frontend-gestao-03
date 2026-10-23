<template>
  <div>
    <!-- HEADER -->
    <header class="header">
      <h1>SUPER_ADMIN DASHBOARD</h1>
      <button class="toggle-btn" @click="toggleTheme">
        {{ isLight ? "🌙" : "☀️" }}
      </button>
    </header>

    <!-- DASHBOARD -->
    <main class="dashboard">
      <!-- DOWNLOADS -->
      <div class="card">
        <h2>NÚMERO DE DOWNLOADS</h2>
        <p class="number">{{ downloads }}</p>
        <span>Quantas vezes o aplicativo foi baixado por escolas</span>
      </div>

      <!-- USUÁRIOS ATIVOS -->
      <div class="card">
        <h2>USUÁRIOS ATIVOS</h2>
        <p class="number">{{ usuariosAtivos }}</p>
        <span>Quantas escolas estão usando o sistema neste momento</span>
      </div>

      <!-- GAUGE -->
      <div class="card">
        <h2>DADOS DE USO</h2>
        <div class="gauge-container">
          <canvas ref="gaugeChart"></canvas>
          <div class="gauge-text">{{ percentualUso }}%</div>
        </div>
        <span>Informações sobre como os usuários estão interagindo com o sistema</span>
      </div>

      <!-- RECEITA POR SERVIÇO -->
      <div class="card">
        <h2>RECEITA MENSAL POR SERVIÇO</h2>
        <div class="chart-container">
          <canvas ref="servicoChart"></canvas>
        </div>
        <span>Ganho mensal por serviço, conforme a taxa de 1,3%</span>
      </div>

      <!-- RECEITA TOTAL BARRAS -->
      <div class="card">
        <h2>RECEITA TOTAL POR MÊS</h2>
        <div class="chart-container">
          <canvas ref="barrasChart"></canvas>
        </div>
        <span>Ganho total mensal conforme a taxa de 1,3%</span>
      </div>

      <!-- RECEITA TOTAL LINHA -->
      <div class="card">
        <h2>RECEITA TOTAL POR MÊS</h2>
        <div class="chart-container">
          <canvas ref="linhaChart"></canvas>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import Chart from "chart.js/auto";

export default {
  name: "SuperAdminDashboard",
  setup() {
    const downloads = ref(0);
    const usuariosAtivos = ref(0);
    const percentualUso = ref(0);
    const isLight = ref(false);

    const gaugeChart = ref(null);
    const servicoChart = ref(null);
    const barrasChart = ref(null);
    const linhaChart = ref(null);

    let gaugeInstance, servicoInstance, barrasInstance, linhaInstance;

    const token = localStorage.getItem("token");

    const api = axios.create({
      baseURL: "http://localhost:3000/api/super",
      headers: { Authorization: `Bearer ${token}` }
    });

    const animateNumber = (refVar, target) => {
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 50));
      const interval = setInterval(() => {
        current += step;
        if (current >= target) {
          refVar.value = target;
          clearInterval(interval);
        } else {
          refVar.value = current;
        }
      }, 20);
    };

    const createGauge = (value) => {
      if (gaugeInstance) gaugeInstance.destroy();
      gaugeInstance = new Chart(gaugeChart.value, {
        type: "doughnut",
        data: {
          datasets: [{
            data: [value, 100 - value],
            backgroundColor: ["limegreen", "#2c2c2c"],
            borderWidth: 0
          }]
        },
        options: {
          rotation: -90,
          circumference: 180,
          cutout: "75%",
          animation: { duration: 2000 },
          plugins: { legend: { display: false }, tooltip: { enabled: false } }
        }
      });
    };

    const createServicoChart = (receitas) => {
      if (servicoInstance) servicoInstance.destroy();
      servicoInstance = new Chart(servicoChart.value, {
        type: "bar",
        data: {
          labels: ["Pix", "Crédito", "Débito", "Dinheiro"],
          datasets: [{
            data: [
              receitas.Pix,
              receitas.Crédito,
              receitas.Débito,
              receitas.Dinheiro
            ],
            backgroundColor: [
              "limegreen",
              "dodgerblue",
              "crimson",
              "orange"
            ]
          }]
        },
        options: {
          animation: { duration: 2000 },
          plugins: { legend: { display: false } },
          responsive: true,
          maintainAspectRatio: false
        }
      });
    };

    const createBarrasChart = (meses, valores) => {
      if (barrasInstance) barrasInstance.destroy();
      barrasInstance = new Chart(barrasChart.value, {
        type: "bar",
        data: {
          labels: meses,
          datasets: [{
            data: valores,
            backgroundColor: "dodgerblue"
          }]
        },
        options: {
          animation: { duration: 2000 },
          plugins: { legend: { display: false } },
          responsive: true,
          maintainAspectRatio: false
        }
      });
    };

    const createLinhaChart = (meses, valores) => {
      if (linhaInstance) linhaInstance.destroy();
      linhaInstance = new Chart(linhaChart.value, {
        type: "line",
        data: {
          labels: meses,
          datasets: [{
            data: valores,
            borderColor: "dodgerblue",
            backgroundColor: "rgba(30,144,255,0.3)",
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          animation: { duration: 2000 },
          plugins: { legend: { display: false } },
          responsive: true,
          maintainAspectRatio: false
        }
      });
    };

    const carregarDashboard = async () => {
      const uso = await api.get("/uso");
      const downloadsRes = await api.get("/downloads");
      const usuariosRes = await api.get("/usuarios-ativos");
      const servicoRes = await api.get("/receita-servico");
      const mensalRes = await api.get("/receita-total-mensal");

      animateNumber(downloads, downloadsRes.data.totalDownloads);
      animateNumber(usuariosAtivos, usuariosRes.data.escolasAtivas);
      percentualUso.value = uso.data.percentualUso;

      createGauge(uso.data.percentualUso);
      createServicoChart(servicoRes.data.receitas);
      createBarrasChart(mensalRes.data.meses, mensalRes.data.receitasBarras);
      createLinhaChart(mensalRes.data.meses, mensalRes.data.receitasLinha);
    };

    const toggleTheme = () => {
      document.body.classList.toggle("light");
      isLight.value = document.body.classList.contains("light");
    };

    onMounted(carregarDashboard);

    return {
      downloads,
      usuariosAtivos,
      percentualUso,
      gaugeChart,
      servicoChart,
      barrasChart,
      linhaChart,
      toggleTheme,
      isLight
    };
  }
};
</script>

<style scoped>
.header {
  text-align: center;
  padding: 20px;
  position: relative;
}

.toggle-btn {
  position: absolute;
  right: 20px;
  top: 20px;
  background: #141b5a;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  color: white;
}

.dashboard {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 20px;
}

.card {
  background: #141b5a;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}

.chart-container {
  width: 100%;
  height: 260px;
}

h2, .number {
  color: #fff;
}

span {
  color: #ddd;
}

.number {
  font-size: 36px;
  font-weight: bold;
}

.gauge-container {
  position: relative;
  height: 160px;
}

.gauge-text {
  position: absolute;
  top: 55%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 28px;
  font-weight: bold;
  color: white;
}

/* LIGHT MODE */
body.light {
  background: #f4f4f4;
}

body.light .card {
  background: #fff;
}

body.light h2,
body.light .number,
body.light span,
body.light .gauge-text {
  color: #222;
}

/* TABLET */
@media (max-width: 1200px) {
  .dashboard {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* MOBILE */
@media (max-width: 768px) {
  .dashboard {
    grid-template-columns: 1fr;
    padding: 12px;
  }

  .toggle-btn {
    position: static;
    margin-top: 10px;
  }

  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .chart-container {
    height: 220px;
  }

  .number {
    font-size: 28px;
  }
}
</style>
