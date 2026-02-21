require("dotenv").config();
const express = require("express");
const cors = require("cors");

const db = require("./models"); // IMPORTA SOMENTE O INDEX.JS DA PASTA MODELS

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rota teste
app.get("/", (req, res) => {
    res.json({ message: "API rodando 🚀" });
});

// IMPORTAÇÃO DAS ROTAS (se você tiver)
// Exemplo:
// const escolaRoutes = require("./routes/escolaRoutes");
// app.use("/api/escolas", escolaRoutes);

// Sincroniza banco e inicia servidor
db.sequelize.sync()
    .then(() => {
        console.log("Banco conectado com sucesso ✅");

        const PORT = process.env.PORT || 3000;

        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Erro ao conectar no banco:", err);
    });