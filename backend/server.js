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

// Frontend
const distPath = path.resolve(__dirname, "dist");
app.use(express.static(distPath));

// Rotas
const authRoutes = require("./routes/authRoutes");
const ativacaoRoutes = require("./routes/ativacaoRoutes");
const escolaRoutes = require("./routes/escolaRoutes");
const modalidadeRoutes = require("./routes/modalidadeRoutes");
const alunoRoutes = require("./routes/alunoRoutes");
const professorRoutes = require("./routes/professorRoutes");
const turmaRoutes = require("./routes/turmaRoutes");
const matriculaRoutes = require("./routes/matriculaRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/ativacao", ativacaoRoutes);
app.use("/api/escolas", escolaRoutes);
app.use("/api/modalidades", modalidadeRoutes);
app.use("/api/alunos", alunoRoutes);
app.use("/api/professores", professorRoutes);
app.use("/api/turmas", turmaRoutes);
app.use("/api/matriculas", matriculaRoutes);

app.get("*", (req, res) => {
    if (!req.path.startsWith("/api")) {
        res.sendFile(path.join(distPath, "index.html"));
    }
});

const PORT = process.env.PORT || 10000;

async function bootstrap() {
    try {
        console.log("📡 Conectando ao MySQL Aiven...");
        await db.sequelize.authenticate();
        console.log("✅ Conexão estabelecida.");

        // Força a sincronização, mas captura erros para não derrubar o servidor
        try {
            await db.sequelize.sync({ alter: true });
            console.log("✅ Tabelas sincronizadas.");
        } catch (syncErr) {
            console.error("⚠️ Aviso: Erro na sincronização automática, mas seguindo adiante...");
        }
        
        // Garante escola ID 2
        await db.Escola.findOrCreate({ 
            where: { id: 2 }, 
            defaults: { id: 2, nome: "Escola de Dança Base", status: "ATIVO" } 
        });

        app.listen(PORT, () => console.log(`🚀 SERVIDOR OK NA PORTA ${PORT}`));
    } catch (err) {
        console.error("❌ Erro fatal:", err.message);
        // Tenta rodar o servidor mesmo com erro de DB para o Render não dar 'Exited Early'
        app.listen(PORT, () => console.log("⚠️ Servidor rodando em modo de emergência."));
    }
}

bootstrap();