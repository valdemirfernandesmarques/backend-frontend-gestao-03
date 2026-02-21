const express = require("express");
const cors = require("cors");
const db = require("./models");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();

app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], allowedHeaders: ["Content-Type", "Authorization"] }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// --- Importação de Rotas ---
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const escolaRoutes = require("./routes/escolaRoutes");
const modalidadeRoutes = require("./routes/modalidadeRoutes");
const professorRoutes = require("./routes/professorRoutes");
const turmaRoutes = require("./routes/turmaRoutes");
const matriculaRoutes = require("./routes/matriculaRoutes");
// (Mantenha as demais importações que você já tem aqui...)

// --- Registro de Rotas ---
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/escolas", escolaRoutes);
app.use("/api/modalidades", modalidadeRoutes);
app.use("/api/professores", professorRoutes);
app.use("/api/turmas", turmaRoutes);
app.use("/api/matriculas", matriculaRoutes);
// (Mantenha os demais app.use que você já tem aqui...)

const PORT = process.env.PORT || 10000;

async function bootstrap() {
  try {
    console.log("🛠️ ENGENHARIA: Iniciando protocolo de recuperação total...");
    await db.sequelize.authenticate();

    // 1️⃣ DESATIVAR TUDO: Desliga as travas do MySQL para permitir a limpeza
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // 2️⃣ LIMPEZA DE CHOQUE: Remove a View problemática e as tabelas que estão impedindo o boot
    console.log("🧹 Removendo View 'professor' e tabelas corrompidas...");
    await db.sequelize.query('DROP VIEW IF EXISTS professor');
    await db.sequelize.query('DROP TABLE IF EXISTS professor');
    await db.sequelize.query('DROP TABLE IF EXISTS Turmas'); 
    await db.sequelize.query('DROP TABLE IF EXISTS Matriculas');

    // 3️⃣ RECONSTRUÇÃO: O Sequelize agora consegue criar as tabelas com as colunas novas (horarioInicio, etc)
    // Usamos 'force: true' UMA ÚLTIMA VEZ para garantir que a estrutura esteja 100% limpa
    await db.sequelize.sync({ force: true }); 
    
    // 4️⃣ REATIVAR TRAVAS
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log("✅ Estrutura de tabelas recriada com sucesso.");

    // 5️⃣ POPULAR DADOS ESSENCIAIS (Escola e Admin)
    await db.Escola.create({
      id: 2,
      nome: "Escola de Dança Base",
      email: "contato@base.com",
      status: "ATIVO"
    });

    const hash = await bcrypt.hash("Gestao@danca202558", 10);
    await db.User.create({
      nome: "Valdemir Admin",
      email: "valdemir.marques1925@gmail.com",
      password: hash,
      perfil: "SUPER_ADMIN",
      escolaId: 2
    });

    console.log("👤 Banco pronto e Usuário Admin (Escola 2) criado.");

    app.listen(PORT, () => {
      console.log(`🚀 SISTEMA RECUPERADO NA PORTA ${PORT}`);
    });

  } catch (err) {
    console.error("❌ Erro Crítico no Bootstrap:", err.message);
    // Se falhar, ainda tentamos subir o servidor para não travar o Render
    if (!app.listening) app.listen(PORT);
  }
}

bootstrap();