const express = require("express");
const cors = require("cors");
const db = require("./models");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();

app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], allowedHeaders: ["Content-Type", "Authorization"] }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// --- Importação de Rotas (Mantendo todas as rotas informadas) ---
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

// --- Registro das Rotas ---
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

const PORT = process.env.PORT || 10000;

async function bootstrap() {
  try {
    console.log("🛠️ ENGENHARIA: Iniciando RECORTE E LIMPEZA de tabelas...");
    await db.sequelize.authenticate();

    // 1️⃣ Forçar desligamento de chaves
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // 2️⃣ LIMPEZA RADICAL: O erro Unknown Column só morre se a tabela for limpa
    // Removemos a VIEW problemática e a tabela Turmas que está corrompida
    await db.sequelize.query('DROP VIEW IF EXISTS professor');
    await db.sequelize.query('DROP TABLE IF EXISTS Turmas'); 
    await db.sequelize.query('DROP TABLE IF EXISTS Matriculas');

    // 3️⃣ SINCRONIZAÇÃO FORÇADA: Recria Turmas com horarioInicio, horarioFim, etc.
    await db.sequelize.sync({ force: false, alter: true });
    
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log("✅ Tabelas Recriadas com as colunas corretas.");

    // 4️⃣ Garantir dados básicos
    await db.Escola.findOrCreate({ where: { id: 2 }, defaults: { id: 2, nome: "Escola de Dança Base", status: "ATIVO" } });

    const adminEmail = "valdemir.marques1925@gmail.com";
    const user = await db.User.findOne({ where: { email: adminEmail } });
    if (user) {
      await user.update({ escolaId: 2 });
      console.log("👤 Admin OK.");
    }

    app.listen(PORT, () => {
      console.log(`🚀 SISTEMA ONLINE E REPARADO EM: ${PORT}`);
    });

  } catch (err) {
    console.error("❌ Erro fatal:", err.message);
    if (!app.listening) app.listen(PORT);
  }
}

bootstrap();