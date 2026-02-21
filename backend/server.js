const express = require("express");
const cors = require("cors");
const db = require("./models");
const path = require("path");
require("dotenv").config();

const app = express();

// Configurações e Middlewares
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], allowedHeaders: ["Content-Type", "Authorization"] }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- SERVIR FRONTEND (CRUCIAL PARA O RENDER) ---
// Isso evita o erro "no such file or directory, stat '.../dist/index.html'"
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

// --- REGISTRO DAS ROTAS NA API ---
app.use("/api/auth", authRoutes);
app.use("/api/ativacao", ativacaoRoutes);
app.use("/api/escolas", escolaRoutes);
app.use("/api/modalidades", modalidadeRoutes);
app.use("/api/alunos", alunoRoutes);
app.use("/api/professores", professorRoutes);
app.use("/api/turmas", turmaRoutes);
app.use("/api/matriculas", matriculaRoutes);

// --- ROTA SPA (FALLBACK PARA INDEX.HTML) ---
// Garante que o usuário consiga navegar pelas rotas do site sem erro 404
app.get("*", (req, res) => {
    if (!req.path.startsWith("/api")) {
        res.sendFile(path.join(distPath, "index.html"));
    }
});

const PORT = process.env.PORT || 10000;

async function bootstrap() {
    try {
        console.log("📡 Conectando ao MySQL da Aiven...");
        await db.sequelize.authenticate();
        console.log("✅ Conexão estabelecida.");

        // Sincroniza o banco sem apagar nada (agora com as colunas já criadas!)
        await db.sequelize.sync({ alter: true });
        
        // Garante escola ID 2 para o sistema rodar
        await db.Escola.findOrCreate({ 
            where: { id: 2 }, 
            defaults: { id: 2, nome: "Escola de Dança Base", status: "ATIVO" } 
        });

        app.listen(PORT, () => {
            console.log(`🚀 SERVIDOR OPERACIONAL NA PORTA ${PORT}`);
        });
    } catch (err) {
        console.error("❌ Erro fatal ao iniciar o servidor:", err.message);
    }
}

bootstrap();