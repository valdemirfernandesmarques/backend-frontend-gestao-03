// backend/server.js
const express = require("express");
const cors = require("cors");
const db = require("./models");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();

// Configuração de CORS: Liberando o seu novo link do Netlify e o localhost para testes
app.use(cors({ 
  origin: [
    "http://localhost:5173", 
    "http://127.0.0.1:5173",
    "https://wondrous-duckanoo-1d4650.netlify.app" // Seu link oficial do Netlify
  ], 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Rota de confirmação visual
app.get("/", (req, res) => {
  res.send("🚀 API Gestão em Dança está online e operante!");
});

// Registro de Rotas
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
      console.log("✅ Super Admin verificado/criado");
    }
  } catch (e) { console.error("Erro ao verificar Admin:", e.message); }
}

const PORT = process.env.PORT || 10000;

if (db.sequelize) {
  // force: false garante que os dados que importar via SQL não sejam apagados
  db.sequelize.sync({ force: false }).then(async () => {
    console.log("🎯 Conectado ao banco com sucesso (Modo Produção)");
    await criarSuperAdmin();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Servidor online na porta ${PORT}`);
    });
  }).catch(err => {
    console.error("❌ Erro de sincronização:", err.message);
    app.listen(PORT, "0.0.0.0");
  });
}

module.exports = app;