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
// 🔥 CORREÇÃO FORÇADA DE COLUNAS (SQL PURO)
// ===========================================
async function realizarManutencaoBanco() {
  try {
    console.log("🛠️ Verificando e criando colunas faltantes manualmente...");

    // Tenta adicionar a coluna 'descricao' na tabela modalidades
    try {
      await db.sequelize.query("ALTER TABLE modalidades ADD COLUMN descricao TEXT AFTER nome;");
      console.log("✅ Coluna 'descricao' adicionada em modalidades.");
    } catch (e) {
      console.log("ℹ️ Coluna 'descricao' já existe ou não pôde ser adicionada.");
    }

    // Tenta adicionar as colunas de horário na tabela turmas
    try {
      await db.sequelize.query("ALTER TABLE turmas ADD COLUMN horarioInicio TIME AFTER nome;");
      await db.sequelize.query("ALTER TABLE turmas ADD COLUMN horarioFim TIME AFTER horarioInicio;");
      console.log("✅ Colunas de horário adicionadas em turmas.");
    } catch (e) {
      console.log("ℹ️ Colunas de horário já existem em turmas.");
    }

    // Tenta adicionar a coluna 'precoAula' se não existir
    try {
        await db.sequelize.query("ALTER TABLE modalidades ADD COLUMN precoAula DECIMAL(10,2) AFTER descricao;");
        console.log("✅ Coluna 'precoAula' adicionada.");
    } catch (e) {
        console.log("ℹ️ Coluna 'precoAula' já existe.");
    }

    // Sincronização final leve
    await db.sequelize.sync({ alter: false });

  } catch (error) {
    console.error("⚠️ Erro na manutenção:", error.message);
  }
}

// ===============================
// ===== Inicialização =====
// ===============================
const PORT = process.env.PORT || 10000;

async function bootstrap() {
  try {
    await db.sequelize.authenticate();
    console.log("📡 Banco Conectado.");

    // Remove a View problemática se houver
    await db.sequelize.query("DROP VIEW IF EXISTS Escolas;");
    
    // Roda a manutenção de colunas antes de subir o servidor
    await realizarManutencaoBanco();

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Falha crítica:", err.message);
    app.listen(PORT);
  }
}

bootstrap();