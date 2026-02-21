const express = require("express");
const cors = require("cors");
const db = require("./models");
const path = require("path");
require("dotenv").config();

const app = express();

// --- CONFIGURAÇÕES BÁSICAS ---
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- SERVIR FRONTEND ---
const distPath = path.resolve(__dirname, "dist");
app.use(express.static(distPath));

// --- REGISTRO DE TODAS AS ROTAS API ---
const authRoutes = require("./routes/authRoutes");
const ativacaoRoutes = require("./routes/ativacaoRoutes");
const escolaRoutes = require("./routes/escolaRoutes");
const modalidadeRoutes = require("./routes/modalidadeRoutes");
const alunoRoutes = require("./routes/alunoRoutes");
const professorRoutes = require("./routes/professorRoutes");
const turmaRoutes = require("./routes/turmaRoutes");
const matriculaRoutes = require("./routes/matriculaRoutes");
const funcionarioRoutes = require("./routes/funcionarioRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/ativacao", ativacaoRoutes);
app.use("/api/escolas", escolaRoutes);
app.use("/api/modalidades", modalidadeRoutes);
app.use("/api/alunos", alunoRoutes);
app.use("/api/professores", professorRoutes);
app.use("/api/turmas", turmaRoutes);
app.use("/api/matriculas", matriculaRoutes);
app.use("/api/funcionarios", funcionarioRoutes);

// Suporte ao Roteamento do React/Vue (F5)
app.get("*", (req, res) => {
    if (!req.path.startsWith("/api")) {
        res.sendFile(path.join(distPath, "index.html"), (err) => {
            if (err) res.status(200).send("🚀 Servidor Online. Aguardando arquivos...");
        });
    }
});

const PORT = process.env.PORT || 10000;

async function bootstrap() {
    try {
        console.log("📡 Conectando ao MySQL Aiven...");
        await db.sequelize.authenticate();
        console.log("✅ Conexão estabelecida com sucesso.");

        /**
         * IMPORTANTE: alter: false
         * Isso garante que o Sequelize NÃO mexa na estrutura que criamos
         * manualmente no script corrigir.js, preservando o AUTO_INCREMENT.
         */
        await db.sequelize.sync({ alter: false });
        console.log("✅ Modelos sincronizados com o banco (Modo Seguro).");
        
        // Garantir escola padrão ativa
        await db.Escola.findOrCreate({ 
            where: { id: 2 }, 
            defaults: { id: 2, nome: "Escola de Dança Base", status: "ATIVO" } 
        });

        app.listen(PORT, () => console.log(`🚀 SERVIDOR OPERACIONAL NA PORTA ${PORT}`));
    } catch (err) {
        console.error("❌ Erro no bootstrap:", err.message);
        // Iniciamos mesmo com erro para permitir que as rotas tentem rodar
        app.listen(PORT, () => console.log("⚠️ Servidor rodando em modo de contingência."));
    }
}

bootstrap();