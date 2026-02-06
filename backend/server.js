// backend/server.js
const express = require("express");
const cors = require("cors");
const db = require("./models");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();

// Configurações Globais
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Rotas do Sistema
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

// Criação do Admin Inicial
async function criarSuperAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "valdemir.marques1925@gmail.com";
    const adminPass = process.env.ADMIN_PASS || "Gestao@danca202558";
    if (db.User) {
      const existente = await db.User.findOne({ where: { email: adminEmail } });
      if (!existente) {
        const hash = await bcrypt.hash(adminPass, 10);
        await db.User.create({ 
          nome: "Super Admin", 
          email: adminEmail, 
          password: hash, 
          perfil: "SUPER_ADMIN" 
        });
        console.log("✅ Super Admin verificado/criado");
      }
    }
  } catch (e) {
    console.error("Erro ao criar Admin:", e.message);
  }
}

const PORT = process.env.PORT || 10000;

// Inicialização com Sincronização
if (db.sequelize) {
  // alter: true tenta modificar as colunas sem deletar os dados existentes
  db.sequelize.sync({ alter: true }).then(async () => {
    console.log("🎯 Banco sincronizado com sucesso!");
    await criarSuperAdmin();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  }).catch(err => {
    console.error("❌ Erro ao sincronizar banco:", err.message);
    // Mantém o servidor em pé mesmo com erro de sincronização para facilitar o debug
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Servidor rodando na porta ${PORT} (Aviso: Falha na sincronização do banco)`);
    });
  });
}

module.exports = app;