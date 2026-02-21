const express = require("express");
const cors = require("cors");
const db = require("./models");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();

// ✅ CORS TOTALMENTE ABERTO PARA TESTE
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ===== IMPORTAÇÃO DAS ROTAS =====
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

// ===== REGISTRO DAS ROTAS =====
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

// =========================================================
// 🔥 OPERAÇÃO DE LIMPEZA PROFUNDA NO BANCO (SQL PURO)
// =========================================================
async function limpezaProfundaBanco() {
  try {
    console.log("🧨 Iniciando Limpeza Profunda...");

    // 1. Desativar verificação de chaves estrangeiras
    await db.sequelize.query("SET FOREIGN_KEY_CHECKS = 0;");

    // 2. Apagar tabelas que estão dando erro de coluna
    const tabelasParaResetar = ['Matriculas', 'Turmas', 'modalidades', 'Alunos', 'Escolas', 'Users'];
    for (const tabela of tabelasParaResetar) {
        await db.sequelize.query(`DROP TABLE IF EXISTS ${tabela};`);
        console.log(`🗑️ Tabela ${tabela} removida.`);
    }

    // 3. Recriar tudo do zero com a estrutura correta do código
    await db.sequelize.sync({ force: true });
    console.log("✅ Tabelas recriadas com sucesso!");

    // 4. Reativar chaves estrangeiras
    await db.sequelize.query("SET FOREIGN_KEY_CHECKS = 1;");

    // 5. Recriar o Super Admin
    const adminEmail = "valdemir.marques1925@gmail.com";
    const adminPass = "Gestao@danca202558";
    const hash = await bcrypt.hash(adminPass, 10);
    
    await db.User.create({
      nome: "Super Admin",
      email: adminEmail,
      password: hash,
      perfil: "SUPER_ADMIN",
      escolaId: null
    });
    console.log("🚀 Super Admin restaurado.");

  } catch (error) {
    console.error("❌ Erro na Limpeza Profunda:", error.message);
  }
}

// ===== INICIALIZAÇÃO =====
const PORT = process.env.PORT || 10000;

async function bootstrap() {
  try {
    await db.sequelize.authenticate();
    console.log("📡 Conectado à Aiven.");

    // EXECUTAR A LIMPEZA (Só precisa rodar uma vez)
    await limpezaProfundaBanco();

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Falha crítica:", err.message);
    app.listen(PORT);
  }
}

bootstrap();