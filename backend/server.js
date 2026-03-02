const express = require("express");
const cors = require("cors");
const db = require("./models");
const bcrypt = require("bcryptjs");
const path = require("path");
require("dotenv").config();

const app = express();

// ===============================
// ✅ Middlewares Globais
// ===============================
app.use(cors());
app.use(express.json()); 

// ✅ Servir arquivos estáticos (Ajustado para ser mais seguro no Windows/Linux)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===============================
// ===== Importação das Rotas =====
// ===============================
// Usando caminhos que funcionam tanto em Windows quanto em Linux (Case-Sensitive)

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
const comissaoRoutes = require("./routes/comissaoRoutes"); // <-- Verifique se o arquivo é comissaoRoutes.js
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

console.log("✅ Todas as rotas (incluindo Comissões) foram registradas!");

// ===============================
// ===== Criação Automática do Super Admin =====
// ===============================
async function criarSuperAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPass = process.env.ADMIN_PASS;
    if (!db.User) return;
    const existente = await db.User.findOne({ where: { email: adminEmail } });
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
    }
  } catch (error) {
    console.error("❌ Erro ao criar Super Admin:", error);
  }
}

// ===============================
// ===== Inicialização =====
// ===============================
const PORT = process.env.PORT || 3000;

db.sequelize.sync().then(async () => {
  console.log("🎯 Banco de dados sincronizado!");
  await criarSuperAdmin();
  app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
}).catch(err => console.error("❌ Erro ao sincronizar banco:", err));