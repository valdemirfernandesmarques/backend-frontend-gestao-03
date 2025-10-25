<!-- frontend/src/views/SuperAdminDashboard.vue -->
<template>
  <div class="dashboard">
    <div class="card" v-for="card in cards" :key="card.title">
      <h2>{{ card.title }}</h2>
      <p v-if="card.number" class="number" :data-value="card.number">0</p>
      <canvas v-if="card.chartId" :id="card.chartId"></canvas>
      <span>{{ card.subtitle }}</span>
    </div>
  </div>
</template>

<script>
import { onMounted } from "vue";
import Chart from "chart.js/auto";

export default {
  name: "SuperAdminDashboard",
  setup() {
    const cards = [
      { title: "NÚMERO DE DOWNLOADS", number: 1234, subtitle: "Quantas vezes o aplicativo foi baixado por escolas" },
      { title: "USUÁRIOS ATIVOS", number: 534, subtitle: "Quantas escolas estão usando o sistema neste momento" },
      { title: "DADOS DE USO", chartId: "usageChart", subtitle: "Informações sobre como os usuários estão interagindo com o sistema" },
      { title: "RECEITA MENSAL POR SERVIÇO", chartId: "serviceChart", subtitle: "Ganho mensal por serviço, conforme a taxa de 1,3%" },
      { title: "RECEITA TOTAL POR MÊS", chartId: "monthChart", subtitle: "Ganho total mensal conforme a taxa de 1,3%" },
      { title: "RECEITA TOTAL POR MÊS (Linha)", chartId: "monthChart2" }
    ];

    const animateNumbers = () => {
      document.querySelectorAll(".number").forEach(num => {
        const target = +num.getAttribute("data-value");
        let count = 0;
        const increment = target / 100;
        const interval = setInterval(() => {
          count += increment;
          if (count >= target) {
            num.textContent = target.toLocaleString();
            clearInterval(interval);
          } else {
            num.textContent = Math.floor(count).toLocaleString();
          }
        }, 20);
      });
    };

    onMounted(() => {
      animateNumbers();

      // Chart exemplos simples (você pode customizar conforme o HTML que enviou)
      const ctxService = document.getElementById("serviceChart");
      if (ctxService) {
        new Chart(ctxService, {
          type: "bar",
          data: { labels: ["Pix", "Cartão", "Boleto"], datasets: [{ label: "Receita", data: [23, 18, 13], backgroundColor: ["limegreen", "dodgerblue", "orange"] }] },
          options: { responsive: true }
        });
      }
    });

    return { cards };
  }
};
</script>

<style scoped>
.dashboard {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.card {
  background: #141b5a;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0px 4px 12px rgba(0,0,0,0.4);
}

.number { font-size: 36px; font-weight: bold; margin: 10px 0; }

@media(max-width:1200px) { .dashboard { grid-template-columns: repeat(2,1fr); } }
@media(max-width:768px) { .dashboard { grid-template-columns: 1fr; } }
</style>
