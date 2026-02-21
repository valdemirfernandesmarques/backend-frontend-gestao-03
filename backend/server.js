const express = require("express");
const cors = require("cors");
const db = require("./models");
const path = require("path");
require("dotenv").config();

const app = express();

// --- CONFIGURAÇÕES DE MIDDLEWARE ---
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- SERVIR FRONTEND (ESSENCIAL PARA O RENDER) ---
// Resolve o erro de diretório (ENOENT) ao buscar o index.html
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
const mensalidadeRoutes = require("./routes/mensalidadeRoutes");
const financeiroRoutes = require("./routes/financeiroRoutes");

// --- REGISTRO DAS ROTAS NA API ---
// Estas rotas devem bater com as chamadas do seu Frontend (Ex: /api/ativacao)
app.use("/api/auth", authRoutes);
app.use("/api/ativacao", ativacaoRoutes);
app.use("/api/escolas", escolaRoutes);
app.use("/api/modalidades", modalidadeRoutes);
app.use("/api/alunos", alunoRoutes);
app.use("/api/professores", professorRoutes);
app.use("/api/turmas", turmaRoutes);
app.use("/api/matriculas", matriculaRoutes);
app.use("/api/mensalidades", mensalidadeRoutes);
app.use("/api/financeiro", financeiroRoutes);

// --- SUPORTE AO ROTEAMENTO DO FRONTEND (SPA) ---
// Garante que se o usuário der F5 em qualquer página, o site não dê 404
app.get("*", (req, res) => {
    if (!req.path.startsWith("/api")) {
        res.sendFile(path.join(distPath, "index.html"), (err) => {
            if (err) {
                res.status(500).send("Erro: A pasta 'dist' não foi encontrada. Certifique-se de rodar o build do frontend e mover a pasta para cá.");
            }
        });
    }
});

const PORT = process.env.PORT || 10000;

async function bootstrap() {
    try {
        console.log("📡 Iniciando conexão com o MySQL na Aiven...");
        await db.sequelize.authenticate();
        console.log("✅ Conexão com o banco de dados estabelecida.");

        // Sincroniza o banco de dados (alter: true tenta criar colunas faltantes)
        await db.sequelize.sync({ alter: true });
        
        // Garante que a escola padrão (ID 2) exista para o sistema não travar no login
        await db.Escola.findOrCreate({ 
            where: { id: 2 }, 
            defaults: { id: 2, nome: "Escola de Dança Base", status: "ATIVO" } 
        });

        app.listen(PORT, () => {
            console.log(`🚀 SERVIDOR ONLINE NA PORTA ${PORT}`);
            console.log(`🔗 Local: http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("❌ Erro fatal ao iniciar o servidor:", err.message);
        process.exit(1);
    }
}

bootstrap();