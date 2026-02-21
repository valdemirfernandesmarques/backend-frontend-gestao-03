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
  origin: [
    "https://gestaoemdanca.com.br", 
    "https://www.gestaoemdanca.com.br",
    "https://seu-site-no-netlify.netlify.app"
  ],
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
// 🔥 RESET E RECRIAÇÃO DO SUPER ADMIN
// ===========================================
async function resetarSuperAdmin() {
  try {
    const adminEmail = "valdemir.marques1925@gmail.com";
    const adminPass = "Gestao@danca202558";

    if (!db.User) {
        console.error("❌ Modelo User não carregado.");
        return;
    }

    // 1. Elimina o utilizador existente para garantir limpeza total
    await db.User.destroy({ where: { email: adminEmail } });
    console.log(`🧹 Antigo Super Admin removido: ${adminEmail}`);

    // 2. Cria o novo hash
    const hash = await bcrypt.hash(adminPass, 10);

    // 3. Cria o utilizador do zero
    await db.User.create({
      nome: "Super Admin",
      email: adminEmail,
      password: hash,
      perfil: "SUPER_ADMIN",
      escolaId: null,
    });

    console.log(`🚀 NOVO Super Admin criado com sucesso: ${adminEmail}`);
    console.log(`🔑 Senha definida para: ${adminPass}`);
  } catch (error) {
    console.error("❌ Erro ao resetar Super Admin:", error.message);
  }
}

// ===============================
// ===== Inicialização =====
// ===============================
const PORT = process.env.PORT || 10000;

async function bootstrap() {
  try {
    await db.sequelize.authenticate();
    console.log("📡 Banco de Dados Conectado.");

    // Limpeza de VIEWs se ainda existirem
    await db.sequelize.query("DROP VIEW IF EXISTS Escolas;");
    
    // Garante que as tabelas existem antes de criar o admin
    await db.Escola.sync();
    await db.User.sync();

    // EXECUTAR O RESET FORÇADO
    await resetarSuperAdmin();

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`✅ Pode tentar o login agora em https://gestaoemdanca.com.br`);
    });
  } catch (err) {
    console.error("⚠️ Falha crítica:", err.message);
    app.listen(PORT);
  }
}

bootstrap();