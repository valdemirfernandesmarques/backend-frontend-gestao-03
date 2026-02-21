const express = require("express");
const cors = require("cors");
const db = require("./models");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], allowedHeaders: ["Content-Type", "Authorization"] }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Servir frontend
app.use(express.static(path.join(__dirname, "dist")));

// --- TODAS AS SUAS ROTAS (MANTIDAS 100%) ---
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

app.get("*", (req, res) => {
    if (!req.path.startsWith("/api")) {
        res.sendFile(path.join(__dirname, "dist", "index.html"));
    }
});

const PORT = process.env.PORT || 10000;

async function bootstrap() {
  try {
    console.log("🛠️ AGENTE DE REPARO: Executando comandos diretos no banco...");
    await db.sequelize.authenticate();

    // 1️⃣ Desativa chaves estrangeiras para permitir a alteração
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');

    // 2️⃣ Comando SQL Direto para criar as colunas faltantes na tabela Turmas
    // Usamos comandos individuais para garantir que o erro 1054 suma
    try {
      await db.sequelize.query("ALTER TABLE Turmas ADD COLUMN IF NOT EXISTS horarioInicio TIME NULL;");
      await db.sequelize.query("ALTER TABLE Turmas ADD COLUMN IF NOT EXISTS horarioFim TIME NULL;");
      await db.sequelize.query("ALTER TABLE Turmas ADD COLUMN IF NOT EXISTS diaDaSemana VARCHAR(255) NULL;");
      console.log("✅ Colunas injetadas com sucesso via SQL Direto.");
    } catch (sqlError) {
      console.log("ℹ️ Nota: Colunas podem já existir ou o banco impediu o ADD manual, tentando sync forçado...");
    }

    // 3️⃣ Sincronização Final
    await db.sequelize.sync({ alter: true });
    
    // 4️⃣ Reativa as chaves
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');
    console.log("✅ Estrutura do banco de dados sincronizada.");

    // Garantir Escola e Admin
    await db.Escola.findOrCreate({ where: { id: 2 }, defaults: { id: 2, nome: "Escola de Dança Base", status: "ATIVO" } });
    const user = await db.User.findOne({ where: { email: "valdemir.marques1925@gmail.com" } });
    if (user) await user.update({ escolaId: 2 });

    app.listen(PORT, () => {
      console.log(`🚀 SERVIDOR OPERAÇÕES OK`);
    });

  } catch (err) {
    console.error("❌ Erro fatal no bootstrap:", err.message);
    if (!app.listening) app.listen(PORT);
  }
}

bootstrap();