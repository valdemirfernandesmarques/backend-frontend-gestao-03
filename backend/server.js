const express = require("express");
const cors = require("cors");
const db = require("./models");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const distPath = path.resolve(__dirname, "dist");
app.use(express.static(distPath));

// Rotas
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/escolas", require("./routes/escolaRoutes"));
app.use("/api/alunos", require("./routes/alunoRoutes"));
app.use("/api/professores", require("./routes/professorRoutes"));
app.use("/api/turmas", require("./routes/turmaRoutes"));
app.use("/api/matriculas", require("./routes/matriculaRoutes"));
app.use("/api/funcionarios", require("./routes/funcionarioRoutes"));

app.get("*", (req, res) => {
    if (!req.path.startsWith("/api")) {
        res.sendFile(path.join(distPath, "index.html"));
    }
});

const PORT = process.env.PORT || 10000;

async function bootstrap() {
    try {
        await db.sequelize.authenticate();
        console.log("📡 Conexão MySQL OK!");
        
        // sync({ alter: false }) para preservar o script de correção
        await db.sequelize.sync({ alter: false });
        console.log("✅ Modelos e Associações carregados com sucesso.");

        app.listen(PORT, () => console.log(`🚀 SERVIDOR RODANDO NA PORTA ${PORT}`));
    } catch (err) {
        console.error("❌ Erro:", err.message);
        app.listen(PORT, () => console.log("⚠️ Modo de segurança."));
    }
}
bootstrap();