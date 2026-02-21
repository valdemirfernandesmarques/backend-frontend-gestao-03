const express = require("express");
const cors = require("cors");
const db = require("./models");
const path = require("path");
require("dotenv").config();

const app = express();

// --- CONFIGURAÇÕES GERAIS ---
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- SERVIR FRONTEND ---
const distPath = path.resolve(__dirname, "dist");
app.use(express.static(distPath));

// --- IMPORTAÇÃO DE ROTAS ---
const authRoutes = require("./routes/authRoutes");
const ativacaoRoutes = require("./routes/ativacaoRoutes");
const escolaRoutes = require("./routes/escolaRoutes");
const modalidadeRoutes = require("./routes/modalidadeRoutes");
const alunoRoutes = require("./routes/alunoRoutes");
const professorRoutes = require("./routes/professorRoutes");
const turmaRoutes = require("./routes/turmaRoutes");
const matriculaRoutes = require("./routes/matriculaRoutes");
const funcionarioRoutes = require("./routes/funcionarioRoutes"); // Rota de Funcionários adicionada

// --- REGISTRO DE ROTAS API ---
app.use("/api/auth", authRoutes);
app.use("/api/ativacao", ativacaoRoutes);
app.use("/api/escolas", escolaRoutes);
app.use("/api/modalidades", modalidadeRoutes);
app.use("/api/alunos", alunoRoutes);
app.use("/api/professores", professorRoutes);
app.use("/api/turmas", turmaRoutes);
app.use("/api/matriculas", matriculaRoutes);
app.use("/api/funcionarios", funcionarioRoutes); // Ativação da rota de Funcionários

// Suporte ao F5 e Roteamento SPA
app.get("*", (req, res) => {
    if (!req.path.startsWith("/api")) {
        res.sendFile(path.join(distPath, "index.html"), (err) => {
            if (err) res.status(200).send("🚀 Servidor Operacional. Aguardando build...");
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
         * IMPORTANTE: alter: false preserva as mudanças manuais 
         * que fizemos via script corrigir.js (Auto-increments e PKs)
         */
        await db.sequelize.sync({ alter: false });
        console.log("✅ Banco de dados sincronizado.");
        
        // Garante escola ID 2 ativa para evitar erros de login/vincular dados
        await db.Escola.findOrCreate({ 
            where: { id: 2 }, 
            defaults: { id: 2, nome: "Escola de Dança Base", status: "ATIVO" } 
        });

        app.listen(PORT, () => console.log(`🚀 SERVIDOR OK NA PORTA ${PORT}`));
    } catch (err) {
        console.error("❌ Erro fatal:", err.message);
        app.listen(PORT, () => console.log("⚠️ Iniciado em modo de recuperação."));
    }
}

bootstrap();