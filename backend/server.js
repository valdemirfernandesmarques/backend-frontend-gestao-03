const express = require("express");
const cors = require("cors");
const db = require("./models");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();

// ===============================
// ✅ CONFIGURAÇÃO DE CORS (Blindado)
// ===============================
app.use(cors({
  origin: ["https://gestaoemdanca.com.br", "https://www.gestaoemdanca.com.br"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ===============================
// ===== IMPORTAÇÃO DAS ROTAS =====
// ===============================
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const ativacaoRoutes = require("./routes/ativacaoRoutes");
const recuperarSenhaRoutes = require("./routes/recuperarSenhaRoutes");
const escolaRoutes = require("./routes/escolaRoutes");
const produtoRoutes = require("./routes/produtoRoutes");
const vendaRoutes = require("./routes/vendaRoutes");
const relatorioRoutes = require("./routes/relatorioRoutes");
const modalidadeRoutes = require("./routes/modalidadeRoutes");
const mensalidadeRoutes = require("./routes/mensalidadeRoutes");
const alunoRoutes = require("./routes/alunoRoutes");
const professorRoutes = require("./routes/professorRoutes");
const turmaRoutes = require("./routes/turmaRoutes");
const matriculaRoutes = require("./routes/matriculaRoutes");
const pagamentoRoutes = require("./routes/pagamentoRoutes");
const funcionarioRoutes = require("./routes/funcionarioRoutes");
const professorModalidadeRoutes = require("./routes/professorModalidadeRoutes");
const comissaoRoutes = require("./routes/comissaoRoutes");
const isencaoTaxaRoutes = require("./routes/isencaoTaxaRoutes");
const financeiroRoutes = require("./routes/financeiroRoutes");
const webhookRoutes = require("./routes/webhookRoutes");
const superAdminDashboardRoutes = require("./routes/superAdminDashboardRoutes");
const transacoesFinanceirasRoutes = require("./routes/transacoesFinanceirasRoutes");

// ===============================
// ===== REGISTRO DAS ROTAS =====
// ===============================
app.use("/api/ativacao", ativacaoRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/auth", recuperarSenhaRoutes);
app.use("/api/users", userRoutes);
app.use("/api/escolas", escolaRoutes);
app.use("/api/produtos", produtoRoutes);
app.use("/api/vendas", vendaRoutes);
app.use("/api/relatorios", relatorioRoutes);
app.use("/api/modalidades", modalidadeRoutes);
app.use("/api/mensalidades", mensalidadeRoutes);
app.use("/api/alunos", alunoRoutes);
app.use("/api/professores", professorRoutes);
app.use("/api/turmas", turmaRoutes);
app.use("/api/matriculas", matriculaRoutes);
app.use("/api/pagamentos", pagamentoRoutes);
app.use("/api/funcionarios", funcionarioRoutes);
app.use("/api/professor-modalidade", professorModalidadeRoutes);
app.use("/api/comissoes", comissaoRoutes);
app.use("/api/isencao-taxa", isencaoTaxaRoutes);
app.use("/api/financeiro", financeiroRoutes);
app.use("/api/webhook", webhookRoutes);
app.use("/api/super", superAdminDashboardRoutes);
app.use("/api/super/transacoes-financeiras", transacoesFinanceirasRoutes);

// ===============================================
// 🛠️ INICIALIZAÇÃO DO SERVIDOR (BOOTSTRAP)
// ===============================================
const PORT = process.env.PORT || 10000;

async function bootstrap() {
  try {
    // 1. Autentica a conexão com a Aiven
    await db.sequelize.authenticate();
    console.log("📡 Conexão com MySQL (Aiven) estabelecida com sucesso.");

    // 2. Sincroniza a estrutura das tabelas. 
    // O 'alter: true' adiciona colunas novas sem apagar os dados existentes.
    await db.sequelize.sync({ force: false, alter: true });
    console.log("✅ Estrutura do banco de dados sincronizada e atualizada.");

    // 3. Garante a existência do Super Admin para acesso inicial
    const adminEmail = "valdemir.marques1925@gmail.com";
    const [user, created] = await db.User.findOrCreate({
      where: { email: adminEmail },
      defaults: {
        nome: "Super Admin",
        email: adminEmail,
        password: await bcrypt.hash("Gestao@danca202558", 10),
        perfil: "SUPER_ADMIN",
        escolaId: null
      }
    });

    if (created) {
      console.log("👤 Super Admin criado pela primeira vez.");
    } else {
      console.log("👤 Super Admin já existe no sistema.");
    }

    // 4. Inicia a escuta das requisições
    app.listen(PORT, () => {
      console.log("--------------------------------------------------");
      console.log(`🚀 SERVIDOR ONLINE NA PORTA ${PORT}`);
      console.log(`🔗 API: https://api-gestao-danca.onrender.com`);
      console.log("--------------------------------------------------");
    });

  } catch (err) {
    console.error("❌ ERRO CRÍTICO NA INICIALIZAÇÃO:");
    console.error(err.message);
    // Tenta manter o processo vivo em caso de erro de conexão temporário
    app.listen(PORT);
  }
}

bootstrap();