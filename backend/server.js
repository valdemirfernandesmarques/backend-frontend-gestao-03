const express = require("express");
const cors = require("cors");
const db = require("./models");
const path = require("path");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Pasta do site (Build)
const distPath = path.resolve(__dirname, "dist");
app.use(express.static(distPath));

// --- REGISTRO DE TODAS AS ROTAS ---
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/ativacao", require("./routes/ativacaoRoutes"));
app.use("/api/escolas", require("./routes/escolaRoutes"));
app.use("/api/modalidades", require("./routes/modalidadeRoutes"));
app.use("/api/alunos", require("./routes/alunoRoutes"));
app.use("/api/professores", require("./routes/professorRoutes"));
app.use("/api/turmas", require("./routes/turmaRoutes"));
app.use("/api/matriculas", require("./routes/matriculaRoutes"));
app.use("/api/funcionarios", require("./routes/funcionarioRoutes"));

// Suporte ao F5 / Frontend
app.get("*", (req, res) => {
    if (!req.path.startsWith("/api")) {
        res.sendFile(path.join(distPath, "index.html"), (err) => {
            if (err) res.status(200).send("🚀 Servidor online. Carregando...");
        });
    }
});

const PORT = process.env.PORT || 10000;

async function bootstrap() {
    try {
        console.log("📡 Conectando ao MySQL Aiven...");
        await db.sequelize.authenticate();
        console.log("✅ Conexão estabelecida.");

        /**
         * IMPORTANTE: alter: false
         * Usamos false para que o Sequelize não tente modificar as tabelas 
         * que acabamos de criar manualmente via script corrigir.js.
         */
        await db.sequelize.sync({ alter: false });
        console.log("✅ Banco de dados sincronizado (Modo Protegido).");
        
        // Garante escola ID 2 ativa
        await db.Escola.findOrCreate({ 
            where: { id: 2 }, 
            defaults: { id: 2, nome: "Escola de Dança Base", status: "ATIVO" } 
        });

        app.listen(PORT, () => console.log(`🚀 SERVIDOR OPERACIONAL NA PORTA ${PORT}`));
    } catch (err) {
        console.error("❌ Erro fatal:", err.message);
        app.listen(PORT, () => console.log("⚠️ Iniciado em modo de segurança."));
    }
}

bootstrap();