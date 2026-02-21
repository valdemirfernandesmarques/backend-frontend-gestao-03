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

const distPath = path.resolve(__dirname, "dist");
app.use(express.static(distPath));

// --- REGISTRO DE ROTAS ---
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/ativacao", require("./routes/ativacaoRoutes"));
app.use("/api/escolas", require("./routes/escolaRoutes"));
app.use("/api/modalidades", require("./routes/modalidadeRoutes"));
app.use("/api/alunos", require("./routes/alunoRoutes"));
app.use("/api/professores", require("./routes/professorRoutes"));
app.use("/api/turmas", require("./routes/turmaRoutes"));
app.use("/api/matriculas", require("./routes/matriculaRoutes"));
app.use("/api/funcionarios", require("./routes/funcionarioRoutes"));

// Rota SPA
app.get("*", (req, res) => {
    if (!req.path.startsWith("/api")) {
        res.sendFile(path.join(distPath, "index.html"), (err) => {
            if (err) res.status(200).send("🚀 Servidor Online.");
        });
    }
});

const PORT = process.env.PORT || 10000;

async function bootstrap() {
    try {
        console.log("📡 Conectando ao MySQL Aiven...");
        await db.sequelize.authenticate();
        
        // --- HACK DE PROTEÇÃO DE AUTO-INCREMENTO ---
        // Isso força o Sequelize a ignorar o ID nos INSERTs, deixando o banco gerar sozinho
        const modelosParaProteger = ['Matricula', 'Mensalidade', 'Funcionario', 'Turma'];
        modelosParaProteger.forEach(nome => {
            if (db[nome] && db[nome].rawAttributes.id) {
                db[nome].rawAttributes.id.autoIncrement = true;
                db[nome].rawAttributes.id.primaryKey = true;
                db[nome].rawAttributes.id.allowNull = false;
            }
        });

        // alter: false para não sobrescrever o que fizemos no script corrigir.js
        await db.sequelize.sync({ alter: false });
        console.log("✅ Banco de dados sincronizado e blindado.");

        await db.Escola.findOrCreate({ 
            where: { id: 2 }, 
            defaults: { id: 2, nome: "Escola de Dança Base", status: "ATIVO" } 
        });

        app.listen(PORT, () => console.log(`🚀 SERVIDOR OPERACIONAL NA PORTA ${PORT}`));
    } catch (err) {
        console.error("❌ Erro fatal:", err.message);
        app.listen(PORT, () => console.log("⚠️ Modo de segurança ativo."));
    }
}

bootstrap();