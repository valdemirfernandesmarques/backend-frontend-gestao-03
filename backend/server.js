// backend/server.js
const express = require("express");
const cors = require("cors");
const db = require("./models");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Rotas
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/alunos", require("./routes/alunoRoutes"));
app.use("/api/professores", require("./routes/professorRoutes"));
app.use("/api/escolas", require("./routes/escolaRoutes"));
app.use("/api/produtos", require("./routes/produtoRoutes"));
app.use("/api/vendas", require("./routes/vendaRoutes"));
app.use("/api/financeiro", require("./routes/financeiroRoutes"));
app.use("/api/turmas", require("./routes/turmaRoutes"));
app.use("/api/matriculas", require("./routes/matriculaRoutes"));

const PORT = process.env.PORT || 10000;

if (db.sequelize) {
  // ATENÇÃO: force: false para preservar seus dados importados
  db.sequelize.sync({ force: false }).then(() => {
    console.log("🎯 Conectado ao banco com sucesso (Modo Produção)");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Servidor online na porta ${PORT}`);
    });
  }).catch(err => {
    console.error("❌ Erro ao conectar:", err.message);
    app.listen(PORT, "0.0.0.0");
  });
}

module.exports = app;