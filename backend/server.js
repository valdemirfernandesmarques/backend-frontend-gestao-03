const express = require("express");
const cors = require("cors");
const db = require("./models");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();

// ===============================
// ✅ Middlewares Globais
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
// ===== Importação das Rotas =====
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
// ===== Registro das Rotas =====
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

// ===========================================
// 🔥 RESET TOTAL E RECONSTRUÇÃO DO BANCO
// ===========================================
async function rebuildDatabase() {
  try {
    const adminEmail = "valdemir.marques1925@gmail.com";
    const adminPass = "Gestao@danca202558";

    console.log("🧨 LIMPANDO BANCO DE DADOS PARA RECONSTRUÇÃO...");

    // Desativa chaves estrangeiras para evitar erro de 'referenced table'
    await db.sequelize.query("SET FOREIGN_KEY_CHECKS = 0;");
    
    // FORÇA A CRIAÇÃO DE TODAS AS TABELAS DO ZERO (CORRIGE COLUNAS FALTANTES)
    await db.sequelize.sync({ force: true });
    
    // Reativa chaves estrangeiras
    await db.sequelize.query("SET FOREIGN_KEY_CHECKS = 1;");
    
    console.log("✅ BANCO DE DADOS RECONSTRUIDO COM SUCESSO!");

    // Recria o Super Admin
    const hash = await bcrypt.hash(adminPass, 10);
    await db.User.create({
      nome: "Super Admin",
      email: adminEmail,
      password: hash,
      perfil: "SUPER_ADMIN",
      escolaId: null,
    });

    console.log(`🚀 Super Admin Recriado: ${adminEmail}`);
  } catch (error) {
    console.error("❌ Erro no Rebuild:", error.message);
  }
}

// ===============================
// ===== Inicialização =====
// ===============================
const PORT = process.env.PORT || 10000;

async function bootstrap() {
  try {
    await db.sequelize.authenticate();
    console.log("📡 Conectado à Aiven.");

    // EXECUTAR RECONSTRUÇÃO (Depois de rodar uma vez e funcionar, você pode mudar force para false)
    await rebuildDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Falha crítica:", err.message);
    app.listen(PORT);
  }
}

bootstrap();