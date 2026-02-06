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

// Registro das rotas principais
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/alunos", require("./routes/alunoRoutes"));
// ... (mantenha as demais rotas aqui)

const PORT = process.env.PORT || 3000;

if (db.sequelize) {
  db.sequelize.sync().then(() => {
    console.log("✅ Banco sincronizado!");
    app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Servidor na porta ${PORT}`));
  }).catch(err => {
    console.error("❌ Erro banco:", err.message);
    app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Servidor na porta ${PORT} (Sem Banco)`));
  });
}

module.exports = app;