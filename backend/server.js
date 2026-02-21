const express = require("express");
const cors = require("cors");
const db = require("./models");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();

// ===============================
// ✅ CONFIGURAÇÃO DE CORS
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
// 🔥 COMANDO DE EMERGÊNCIA: RESET TOTAL DO BANCO
// ===============================================
async function resetBancoDeDados() {
  try {
    console.log("⚠️ ATENÇÃO: Iniciando destruição e recriação das tabelas...");
    
    // Desliga as travas de segurança do MySQL
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
    
    // Sincroniza forçando a exclusão de tudo (limpa o lixo da Aiven)
    await db.sequelize.sync({ force: true });
    
    // Religação das travas
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');
    
    console.log("✅ Banco de dados reconstruído do zero com sucesso!");

    // Recria o Super Admin inicial
    const adminEmail = "valdemir.marques1925@gmail.com";
    const hash = await bcrypt.hash("Gestao@danca202558", 10);
    await db.User.create({
      nome: "Super Admin",
      email: adminEmail,
      password: hash,
      perfil: "SUPER_ADMIN",
      escolaId: null
    });
    console.log("👤 Super Admin recriado.");

  } catch (error) {
    console.error("❌ Erro no reset do banco:", error.message);
  }
}

// ===============================
// ===== INICIALIZAÇÃO =====
// ===============================
const PORT = process.env.PORT || 10000;

async function bootstrap() {
  try {
    await db.sequelize.authenticate();
    console.log("📡 Conectado ao MySQL da Aiven.");

    // RODAR O RESET (Uma única vez para consertar o banco)
    await resetBancoDeDados();

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Erro ao iniciar servidor:", err.message);
  }
}

bootstrap();