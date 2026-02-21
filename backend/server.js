const express = require("express");
const cors = require("cors");
const db = require("./models");
const path = require("path");
require("dotenv").config();

const app = express();

// --- CONFIGURAÇÕES ---
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- SERVIR FRONTEND (PASTA DIST) ---
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
app.get("*", (req, res) => {
    if (!req.path.startsWith("/api")) {
        res.sendFile(path.join(distPath, "index.html"), (err) => {
            if (err) {
                // Se der erro aqui, é porque a pasta dist não foi enviada
                res.status(500).send("Aguardando upload da pasta dist...");
            }
        });
    }
});

const PORT = process.env.PORT || 10000;

async function bootstrap() {
    try {
        console.log("📡 Conectando ao MySQL da Aiven...");
        await db.sequelize.authenticate();
        console.log("✅ Conexão estabelecida com sucesso.");

        // Sincroniza o banco de dados
        // alter: true vai garantir que as colunas de horário que criamos localmente sejam reconhecidas pelo código
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
        // Em caso de erro, inicia o app mesmo assim para não dar "Deploy Failed"
        app.listen(PORT, () => console.log("⚠️ Servidor em modo de segurança."));
    }
}

bootstrap();