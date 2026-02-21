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

// --- SERVIR FRONTEND (BUILD) ---
const distPath = path.resolve(__dirname, "dist");
app.use(express.static(distPath));

// --- REGISTRO DE TODAS AS ROTAS API ---
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/ativacao", require("./routes/ativacaoRoutes"));
app.use("/api/escolas", require("./routes/escolaRoutes"));
app.use("/api/modalidades", require("./routes/modalidadeRoutes"));
app.use("/api/alunos", require("./routes/alunoRoutes"));
app.use("/api/professores", require("./routes/professorRoutes"));
app.use("/api/turmas", require("./routes/turmaRoutes"));
app.use("/api/matriculas", require("./routes/matriculaRoutes"));
app.use("/api/funcionarios", require("./routes/funcionarioRoutes"));

// Suporte ao F5 e Roteamento Frontend (SPA)
app.get("*", (req, res) => {
    if (!req.path.startsWith("/api")) {
        res.sendFile(path.join(distPath, "index.html"), (err) => {
            if (err) res.status(200).send("🚀 Servidor Operacional. Carregando sistema...");
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
         * BLINDAGEM DE MODELOS:
         * Forçamos o Sequelize a entender que o ID é gerado pelo banco.
         * Isso evita o erro 'Field id doesn't have a default value'.
         */
        const modelosCriticos = ['Matricula', 'Mensalidade', 'Funcionario', 'Turma', 'Aluno'];
        modelosCriticos.forEach(m => {
            if (db[m] && db[m].rawAttributes.id) {
                db[m].rawAttributes.id.autoIncrement = true;
                db[m].rawAttributes.id.allowNull = false;
            }
        });

        // alter: false para preservar nossas correções manuais do script corrigir.js
        await db.sequelize.sync({ alter: false });
        console.log("✅ Banco de dados sincronizado e protegido.");

        // Garante a existência da escola ID 2
        await db.Escola.findOrCreate({ 
            where: { id: 2 }, 
            defaults: { id: 2, nome: "Escola de Dança Gestão", status: "ATIVO" } 
        });

        app.listen(PORT, () => console.log(`🚀 SERVIDOR TOTALMENTE OPERACIONAL NA PORTA ${PORT}`));
    } catch (err) {
        console.error("❌ Erro fatal no bootstrap:", err.message);
        app.listen(PORT, () => console.log("⚠️ Iniciado em modo de segurança."));
    }
}

bootstrap();