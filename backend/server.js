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

// Servir Frontend (Pasta dist)
const distPath = path.resolve(__dirname, "dist");
app.use(express.static(distPath));

// --- IMPORTAÇÃO DE TODAS AS ROTAS ---
const authRoutes = require("./routes/authRoutes");
const ativacaoRoutes = require("./routes/ativacaoRoutes");
const escolaRoutes = require("./routes/escolaRoutes");
const modalidadeRoutes = require("./routes/modalidadeRoutes");
const alunoRoutes = require("./routes/alunoRoutes");
const professorRoutes = require("./routes/professorRoutes");
const turmaRoutes = require("./routes/turmaRoutes");
const matriculaRoutes = require("./routes/matriculaRoutes");
const financeiroRoutes = require("./routes/financeiroRoutes");

// --- REGISTRO DAS ROTAS ---
app.use("/api/auth", authRoutes);
app.use("/api/ativacao", ativacaoRoutes);
app.use("/api/escolas", escolaRoutes);
app.use("/api/modalidades", modalidadeRoutes);
app.use("/api/alunos", alunoRoutes);
app.use("/api/professores", professorRoutes);
app.use("/api/turmas", turmaRoutes);
app.use("/api/matriculas", matriculaRoutes);
app.use("/api/financeiro", financeiroRoutes);

// Suporte ao F5 do Frontend
app.get("*", (req, res) => {
    if (!req.path.startsWith("/api")) {
        res.sendFile(path.join(distPath, "index.html"), (err) => {
            if (err) res.status(500).send("Erro: Pasta 'dist' não encontrada. Rode 'npm run build' no frontend.");
        });
    }
});

const PORT = process.env.PORT || 10000;

async function bootstrap() {
    try {
        console.log("📡 Conectando ao MySQL Aiven...");
        await db.sequelize.authenticate();
        console.log("✅ Conexão OK.");

        // Sincroniza com o banco sem forçar (force: false)
        await db.sequelize.sync({ alter: true });
        
        // Garante escola padrão ID 2
        await db.Escola.findOrCreate({ 
            where: { id: 2 }, 
            defaults: { id: 2, nome: "Escola Base", status: "ATIVO" } 
        });

        app.listen(PORT, () => {
            console.log(`🚀 SERVIDOR RODANDO NA PORTA ${PORT}`);
        });
    } catch (err) {
        console.error("❌ Erro fatal no servidor:", err.message);
        // Não encerra o processo para permitir que o Render mantenha o log
    }
}

bootstrap();