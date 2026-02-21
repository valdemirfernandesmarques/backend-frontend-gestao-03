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
// Adicionando Vendas e Comissões para evitar erros futuros
app.use("/api/vendas", require("./routes/vendaRoutes"));
app.use("/api/comissoes", require("./routes/comissaoRoutes"));

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
        await db.sequelize.authenticate();
        console.log("✅ MySQL Conectado com Sucesso.");

        /**
         * AJUSTE TÉCNICO AVANÇADO:
         * Removemos o 'id' da lista de atributos que o Sequelize tenta inserir.
         * Isso obriga o banco de dados Aiven a usar o AUTO_INCREMENT nativo.
         */
        const modelosParaCorrigir = ['Matricula', 'Mensalidade', 'Funcionario', 'Turma', 'Venda', 'Comissao'];
        modelosParaCorrigir.forEach(nome => {
            if (db[nome]) {
                // Remove o ID da inserção automática
                db[nome].removeAttribute('id'); 
                // Define que o ID existe mas é gerado pelo banco
                db[nome].init(db[nome].getAttributes(), { 
                    sequelize: db.sequelize,
                    modelName: nome,
                    autoIncrement: true 
                });
            }
        });

        // alter: false é sagrado agora para não estragar o banco
        await db.sequelize.sync({ alter: false });
        
        await db.Escola.findOrCreate({ 
            where: { id: 2 }, 
            defaults: { nome: "Escola de Dança Gestão", status: "ATIVO" } 
        });

        app.listen(PORT, () => console.log(`🚀 SERVIDOR OPERACIONAL NA PORTA ${PORT}`));
    } catch (err) {
        console.error("❌ Erro fatal:", err.message);
        app.listen(PORT, () => console.log("⚠️ Modo de recuperação."));
    }
}
bootstrap();