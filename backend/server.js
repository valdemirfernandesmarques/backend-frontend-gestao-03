// backend/server.js
const express = require("express");
const cors = require("cors");
const db = require("./models");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();

// ===============================
// ✅ Middlewares Globais
// ===============================
app.use(cors());
app.use(express.json()); // garante que o body seja processado corretamente

// ✅ Servir arquivos estáticos da pasta uploads
app.use("/uploads", express.static("uploads"));

// ===============================
// ===== Importação das Rotas =====
// ===============================

// Auth / Usuários
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

// 🔓 ATIVAÇÃO (rota pública)
const ativacaoRoutes = require("./routes/ativacaoRoutes");

// 🔐 RECUPERAÇÃO DE SENHA (rota pública)
const recuperarSenhaRoutes = require("./routes/recuperarSenhaRoutes");

// ADMIN_ESCOLA
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

// 🔔 WEBHOOK (Gateway agnóstico — SEM authMiddleware)
const webhookRoutes = require("./routes/webhookRoutes");

// 🚀 SUPER_ADMIN (ROTAS ISOLADAS)
const superAdminDashboardRoutes = require("./routes/superAdminDashboardRoutes");
const transacoesFinanceirasRoutes = require("./routes/transacoesFinanceirasRoutes");

// ===============================
// ===== Registro das Rotas =====
// ===============================

// 🔓 ATIVAÇÃO (pública)
app.use("/api/ativacao", ativacaoRoutes);

// 🔐 AUTH + RECUPERAÇÃO DE SENHA (públicas)
app.use("/api/auth", authRoutes);
app.use("/api/auth", recuperarSenhaRoutes);

// Usuários
app.use("/api/users", userRoutes);

// ADMIN_ESCOLA
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

// 🔔 WEBHOOK (não usa authMiddleware)
app.use("/api/webhook", webhookRoutes);

// 🚀 SUPER_ADMIN (TOTALMENTE ISOLADO DO ADMIN_ESCOLA)
app.use("/api/super", superAdminDashboardRoutes);

// 🚀 SUPER_ADMIN — FINANCEIRO DA PLATAFORMA
// (Transações, taxas, isenções, gateway, split, etc.)
app.use(
  "/api/super/transacoes-financeiras",
  transacoesFinanceirasRoutes
);

// ===============================
// ===== Criação Automática do Super Admin =====
// ===============================
async function criarSuperAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPass = process.env.ADMIN_PASS;

    if (!db.User) {
      console.error("❌ Modelo User não encontrado no banco de dados.");
      return;
    }

    const existente = await db.User.findOne({
      where: { email: adminEmail },
    });

    if (!existente) {
      const hash = await bcrypt.hash(adminPass, 10);

      await db.User.create({
        nome: "Super Admin",
        email: adminEmail,
        password: hash,
        perfil: "SUPER_ADMIN",
        escolaId: null,
      });

      console.log(`✅ Super Admin criado: ${adminEmail}`);
    } else {
      console.log(`ℹ️ Super Admin já existe: ${adminEmail}`);
    }
  } catch (error) {
    console.error("❌ Erro ao criar Super Admin:", error);
  }
}

// ===============================
// ===== Inicialização do Servidor =====
// ===============================
const PORT = process.env.PORT || 3000;

if (db.sequelize) {
  db.sequelize
    .sync()
    .then(async () => {
      console.log("🎯 Banco de dados sincronizado!");
      await criarSuperAdmin();

      app.listen(PORT, () =>
        console.log(`🚀 Servidor rodando na porta ${PORT}`)
      );
    })
    .catch((err) => {
      console.error("❌ Erro ao sincronizar banco:", err);
    });
} else {
  console.error(
    "❌ db.sequelize não encontrado. Verifique o arquivo models/index.js"
  );
}
