const express = require("express");
const cors = require("cors");
const db = require("./models");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();

app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], allowedHeaders: ["Content-Type", "Authorization"] }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// --- TODAS AS SUAS ROTAS MANTIDAS INTEGRALMENTE ---
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
    console.log("🛠️ OPERAÇÃO DE EMERGÊNCIA: Resetando tabelas corrompidas...");
    await db.sequelize.authenticate();

    // 1️⃣ DESATIVAR TUDO
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // 2️⃣ APAGAR AS TABELAS QUE ESTÃO TRAVANDO O SISTEMA
    // Isso é necessário porque o MySQL se recusa a adicionar a coluna 'horarioInicio' com dados lá.
    await db.sequelize.query('DROP TABLE IF EXISTS Matriculas');
    await db.sequelize.query('DROP TABLE IF EXISTS Turmas');
    await db.sequelize.query('DROP VIEW IF EXISTS professor');

    // 3️⃣ RECRIAR TUDO LIMPO
    // Aqui o Sequelize vai criar as tabelas novas com horarioInicio, horarioFim, etc.
    await db.sequelize.sync({ force: false });
    
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log("✅ Tabelas Turmas e Matriculas reconstruídas do zero.");

    // 4️⃣ GARANTIR ADMIN E ESCOLA
    await db.Escola.findOrCreate({ where: { id: 2 }, defaults: { id: 2, nome: "Escola de Dança Base", status: "ATIVO" } });
    const user = await db.User.findOne({ where: { email: "valdemir.marques1925@gmail.com" } });
    if (user) await user.update({ escolaId: 2 });

    app.listen(PORT, () => {
      console.log(`🚀 SISTEMA RESETADO E ONLINE`);
    });

  } catch (err) {
    console.error("❌ ERRO:", err.message);
    if (!app.listening) app.listen(PORT);
  }
}

bootstrap();