const express = require("express");
const cors = require("cors");
const db = require("./models");
const path = require("path");
require("dotenv").config();

const app = express();

// --- MIDDLEWARES ---
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- SERVIR FRONTEND (BUILD) ---
const distPath = path.resolve(__dirname, "dist");
app.use(express.static(distPath));

// --- REGISTRO DE ROTAS API ---
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/ativacao", require("./routes/ativacaoRoutes"));
app.use("/api/escolas", require("./routes/escolaRoutes"));
app.use("/api/modalidades", require("./routes/modalidadeRoutes"));
app.use("/api/alunos", require("./routes/alunoRoutes"));
app.use("/api/professores", require("./routes/professorRoutes"));
app.use("/api/turmas", require("./routes/turmaRoutes"));
app.use("/api/matriculas", require("./routes/matriculaRoutes"));

// --- SUPORTE A ROTAS DO FRONTEND (SPA) ---
app.get("*", (req, res) => {
    if (!req.path.startsWith("/api")) {
        const indexPath = path.join(distPath, "index.html");
        res.sendFile(indexPath, (err) => {
            if (err) {
                res.status(200).send("🚀 Servidor Online. Aguardando sincronização de arquivos do frontend...");
            }
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
         * ATENÇÃO: alter: false é fundamental aqui.
         * Isso impede que o Sequelize tente desfazer as correções manuais 
         * que fizemos via script 'corrigir.js'.
         */
        await db.sequelize.sync({ alter: false });
        console.log("✅ Tabelas sincronizadas com segurança.");
        
        // Garante que a escola padrão (ID 2) exista para o login e cadastros
        await db.Escola.findOrCreate({ 
            where: { id: 2 }, 
            defaults: { id: 2, nome: "Escola de Dança Base", status: "ATIVO" } 
        });

        app.listen(PORT, () => {
            console.log(`🚀 SERVIDOR OPERACIONAL NA PORTA ${PORT}`);
        });
    } catch (err) {
        console.error("❌ Erro fatal ao iniciar o servidor:", err.message);
        // Mantém o processo vivo no Render mesmo em caso de erro na conexão inicial
        app.listen(PORT, () => console.log("⚠️ Servidor em modo de recuperação."));
    }
}

bootstrap();