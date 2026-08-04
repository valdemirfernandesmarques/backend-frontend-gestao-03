// backend/server.js
const express = require("express");
const cors = require("cors");
const db = require("./models");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();

app.use(cors({ 
  origin: function (origin, callback) { callback(null, true); },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => res.send("🚀 API Gestão em Dança Online"));

// Registro de Rotas - Adicionadas as rotas que deram erro 404
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

// Rotas extras para limpar os erros do Dashboard
app.get("/api/super/uso", (req, res) => res.json({ totalAlunos: 0, totalProfessores: 0 }));
app.get("/api/isencao-taxa", (req, res) => res.json([]));
app.get("/api/super/transacoes-financeiras/resumo", (req, res) => res.json({ total: 0, entradas: 0, saidas: 0 }));

async function criarSuperAdmin() {
  try {
    const adminEmail = "valdemir.marques1925@gmail.com";
    const adminPass = "Gestao@danca202558";
    const existente = await db.User.findOne({ where: { email: adminEmail } });
    if (!existente) {
      const hash = await bcrypt.hash(adminPass, 10);
      await db.User.create({ 
        nome: "Super Admin", email: adminEmail, password: hash, perfil: "SUPER_ADMIN" 
      });
      console.log("✅ Super Admin Pronto");
    }
  } catch (e) { console.error("Erro Admin:", e.message); }
}

const PORT = process.env.PORT || 10000;

db.sequelize.sync({ force: false }).then(async () => {
  await criarSuperAdmin();
  app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Servidor na porta ${PORT}`));
});

module.exports = app;