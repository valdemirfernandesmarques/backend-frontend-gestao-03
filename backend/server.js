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

// Frontend (Pasta dist)
const distPath = path.resolve(__dirname, "dist");
app.use(express.static(distPath));

// Importação das rotas
const authRoutes = require("./routes/authRoutes");
const ativacaoRoutes = require("./routes/ativacaoRoutes");
const escolaRoutes = require("./routes/escolaRoutes");
const modalidadeRoutes = require("./routes/modalidadeRoutes");
const alunoRoutes = require("./routes/alunoRoutes");
const professorRoutes = require("./routes/professorRoutes");
const turmaRoutes = require("./routes/turmaRoutes");
const matriculaRoutes = require("./routes/matriculaRoutes");

// Registro das rotas
app.use("/api/auth", authRoutes);
app.use("/api/ativacao", ativacaoRoutes);
app.use("/api/escolas", escolaRoutes);
app.use("/api/modalidades", modalidadeRoutes);
app.use("/api/alunos", alunoRoutes);
app.use("/api/professores", professorRoutes);
app.use("/api/turmas", turmaRoutes);
app.use("/api/matriculas", matriculaRoutes);

// Suporte ao roteamento SPA (Single Page Application)
app.get("*", (req, res) => {
    if (!req.path.startsWith("/api")) {
        res.sendFile(path.join(distPath, "index.html"), (err) => {
            if (err) {
                res.status(200).send("<h3>Servidor Online</h3><p>Aguardando upload dos arquivos do site via Git...</p>");
            }
        });
    }
});

const PORT = process.env.PORT || 10000;

async function bootstrap() {
    try {
        console.log("📡 Conectando ao MySQL da Aiven...");
        await db.sequelize.authenticate();
        console.log("✅ Conexão estabelecida.");

        // Sincroniza o banco de forma resiliente
        try {
            await db.sequelize.sync({ alter: true });
            console.log("✅ Tabelas sincronizadas.");
        } catch (syncErr) {
            console.log("⚠️ Sincronização automática ignorada (usando tabelas corrigidas manualmente).");
        }
        
        // Garante a existência da escola ID 2
        await db.Escola.findOrCreate({ 
            where: { id: 2 }, 
            defaults: { id: 2, nome: "Escola de Dança Gestão", status: "ATIVO" } 
        });

        app.listen(PORT, () => console.log(`🚀 SERVIDOR OPERACIONAL NA PORTA ${PORT}`));
    } catch (err) {
        console.error("❌ Erro ao iniciar servidor:", err.message);
        app.listen(PORT, () => console.log("⚠️ Servidor rodando em modo de emergência."));
    }
}

bootstrap();