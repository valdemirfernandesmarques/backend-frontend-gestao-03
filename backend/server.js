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

async function criarSuperAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "valdemir.marques1925@gmail.com";
    const adminPass = process.env.ADMIN_PASS || "Gestao@danca202558";
    const existente = await db.User.findOne({ where: { email: adminEmail } });
    if (!existente) {
      const hash = await bcrypt.hash(adminPass, 10);
      await db.User.create({ 
        nome: "Super Admin", 
        email: adminEmail, 
        password: hash, 
        perfil: "SUPER_ADMIN" 
      });
      console.log("✅ Super Admin verificado");
    }
  } catch (e) { console.error("Erro Admin:", e.message); }
}

const PORT = process.env.PORT || 10000;

if (db.sequelize) {
  // PASSO 1: Desativa as travas de chave estrangeira
  db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
    .then(() => {
      // PASSO 2: Força a sincronização (limpa o banco antigo)
      return db.sequelize.sync({ force: true });
    })
    .then(() => {
      // PASSO 3: Reativa as travas para manter a segurança
      return db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    })
    .then(async () => {
      console.log("🎯 BANCO RESETADO E CORRIGIDO COM SUCESSO!");
      await criarSuperAdmin();
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`🚀 Servidor online na porta ${PORT}`);
      });
    })
    .catch(err => {
      console.error("❌ Erro fatal:", err.message);
      app.listen(PORT, "0.0.0.0");
    });
}

module.exports = app;