const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const db = require("./models");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();

// ===============================
// ✅ Configuração de Pastas e Estáticos
// ===============================
const uploadsPath = path.resolve(__dirname, "uploads");
const produtosPath = path.join(uploadsPath, "produtos");
const logosPath = path.join(uploadsPath, "logos");

[uploadsPath, produtosPath, logosPath].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

app.use("/uploads", express.static(uploadsPath));

// ===============================
// ✅ Middlewares
// ===============================
app.use(cors());
app.use(express.json());

// ===============================
// 🚀 Importação das Rotas
// ===============================
const authRoutes = require("./routes/authRoutes");
const escolaRoutes = require("./routes/escolaRoutes");
const alunoRoutes = require("./routes/alunoRoutes");
const professorRoutes = require("./routes/professorRoutes");
const modalidadeRoutes = require("./routes/modalidadeRoutes");
const turmaRoutes = require("./routes/turmaRoutes");
const matriculaRoutes = require("./routes/matriculaRoutes");
const funcionarioRoutes = require("./routes/funcionarioRoutes");
const financeiroRoutes = require("./routes/financeiroRoutes");
const produtoRoutes = require("./routes/produtoRoutes");
const vendaRoutes = require("./routes/vendaRoutes");
const comissaoRoutes = require("./routes/comissaoRoutes"); // ✅ Essencial
const ativacaoRoutes = require("./routes/ativacaoRoutes");
const isencaoTaxaRoutes = require("./routes/isencaoTaxaRoutes");
const superAdminDashboardRoutes = require("./routes/superAdminDashboardRoutes");

// ===============================
// 🚀 Registro das Rotas
// ===============================
app.use("/api/auth", authRoutes);
app.use("/api/escolas", escolaRoutes);
app.use("/api/alunos", alunoRoutes);
app.use("/api/professores", professorRoutes);
app.use("/api/modalidades", modalidadeRoutes);
app.use("/api/turmas", turmaRoutes);
app.use("/api/matriculas", matriculaRoutes);
app.use("/api/funcionarios", funcionarioRoutes);
app.use("/api/financeiro", financeiroRoutes);
app.use("/api/produtos", produtoRoutes);
app.use("/api/vendas", vendaRoutes);
app.use("/api/comissoes", comissaoRoutes); // ✅ Resolve o Erro 404
app.use("/api/ativacao", ativacaoRoutes);
app.use("/api/isencao-taxa", isencaoTaxaRoutes);
app.use("/api/super", superAdminDashboardRoutes);

app.use((req, res) => {
  console.log(`⚠️ Rota não encontrada no Backend: ${req.method} ${req.url}`);
  res.status(404).json({ error: "Rota não encontrada" });
});

// ===============================
// 🎯 Inicialização
// ===============================
const PORT = process.env.PORT || 10000;

db.sequelize.sync().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
  });
}).catch(err => {
  console.error("❌ Erro ao sincronizar banco:", err.message);
});