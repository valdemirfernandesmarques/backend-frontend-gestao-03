require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Importa o index.js dos models (ELE já faz as associações)
const db = require("./models");

// Rotas
app.get("/", (req, res) => {
  res.send("API rodando 🚀");
});

// Sincroniza banco (sem alterar estrutura)
db.sequelize.authenticate()
  .then(() => {
    console.log("✅ Conectado ao banco de dados.");
    app.listen(process.env.PORT || 3000, () => {
      console.log("🚀 Servidor rodando...");
    });
  })
  .catch((err) => {
    console.error("❌ Erro ao conectar no banco:", err);
  });