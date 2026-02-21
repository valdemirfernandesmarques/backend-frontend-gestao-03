const express = require("express");
const cors = require("cors");
const db = require("./models");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], allowedHeaders: ["Content-Type", "Authorization"] }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// CORREÇÃO DO CAMINHO DO FRONTEND
const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));

// --- ROTAS DA API ---
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const escolaRoutes = require("./routes/escolaRoutes");
const modalidadeRoutes = require("./routes/modalidadeRoutes");
const alunoRoutes = require("./routes/alunoRoutes");
const professorRoutes = require("./routes/professorRoutes");
const turmaRoutes = require("./routes/turmaRoutes");
const matriculaRoutes = require("./routes/matriculaRoutes");
// (Mantenha as outras rotas que você já tem aqui...)

app.use("/api/auth", authRoutes);
app.use("/api/escolas", escolaRoutes);
app.use("/api/modalidades", modalidadeRoutes);
app.use("/api/alunos", alunoRoutes);
app.use("/api/professores", professorRoutes);
app.use("/api/turmas", turmaRoutes);
app.use("/api/matriculas", matriculaRoutes);

// ROTA CORRIGIDA PARA SERVIR O INDEX.HTML
app.get("*", (req, res) => {
    if (!req.path.startsWith("/api")) {
        const indexPath = path.join(distPath, "index.html");
        res.sendFile(indexPath);
    }
});

const PORT = process.env.PORT || 10000;

async function bootstrap() {
  try {
    console.log("🛠️ OPERAÇÃO DE CHOQUE: Resetando estrutura...");
    await db.sequelize.authenticate();

    // 1️⃣ Mata as travas de segurança
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');

    // 2️⃣ FORÇA A ATUALIZAÇÃO (Isso vai recriar as tabelas com as colunas novas)
    // Usamos force: true uma vez para garantir que 'horarioInicio' seja criado
    await db.sequelize.sync({ force: false, alter: true });
    
    // 3️⃣ Se mesmo com alter:true não foi, vamos dar o comando manual bruto:
    try {
        await db.sequelize.query("ALTER TABLE Turmas ADD COLUMN IF NOT EXISTS horarioInicio TIME;");
        await db.sequelize.query("ALTER TABLE Turmas ADD COLUMN IF NOT EXISTS horarioFim TIME;");
    } catch (e) { console.log("Colunas já existem ou erro no ALTER manual"); }

    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');
    console.log("✅ BANCO SINCRONIZADO.");

    app.listen(PORT, () => {
      console.log(`🚀 SERVIDOR RODANDO NA PORTA ${PORT}`);
    });

  } catch (err) {
    console.error("❌ Erro fatal:", err.message);
    if (!app.listening) app.listen(PORT);
  }
}

bootstrap();