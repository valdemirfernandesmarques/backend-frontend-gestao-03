const express = require("express");
const cors = require("cors");
const db = require("./models");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();

// ✅ Configuração de CORS profissional
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ===============================================
// 🛣️ REGISTRO DAS ROTAS (Importação e Uso)
// ===============================================
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const escolaRoutes = require("./routes/escolaRoutes");
const modalidadeRoutes = require("./routes/modalidadeRoutes");
const professorRoutes = require("./routes/professorRoutes");
const turmaRoutes = require("./routes/turmaRoutes");
const alunoRoutes = require("./routes/alunoRoutes");
const matriculaRoutes = require("./routes/matriculaRoutes");
const pagamentoRoutes = require("./routes/pagamentoRoutes");
const financeiroRoutes = require("./routes/financeiroRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/escolas", escolaRoutes);
app.use("/api/modalidades", modalidadeRoutes);
app.use("/api/professores", professorRoutes);
app.use("/api/turmas", turmaRoutes);
app.use("/api/alunos", alunoRoutes);
app.use("/api/matriculas", matriculaRoutes);
app.use("/api/pagamentos", pagamentoRoutes);
app.use("/api/financeiro", financeiroRoutes);

// ===============================================
// 🛠️ BOOTSTRAP: REPARO DE BANCO E INICIALIZAÇÃO
// ===============================================
const PORT = process.env.PORT || 10000;

async function bootstrap() {
  try {
    console.log("🛠️ ENGENHARIA: Verificando integridade do banco...");
    await db.sequelize.authenticate();
    console.log("📡 Conexão MySQL OK.");

    // 1️⃣ Forçar desligamento de travas para permitir a correção de colunas
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // 2️⃣ Limpeza de View fantasma (causadora do erro 500 no Professor)
    await db.sequelize.query('DROP VIEW IF EXISTS professor');
    
    // 3️⃣ SINCRONIZAÇÃO FORÇADA DE COLUNAS
    // 'alter: true' vai injetar 'horarioInicio', 'horarioFim' etc., na tabela Turmas
    await db.sequelize.sync({ alter: true });
    console.log("✅ Colunas e tabelas sincronizadas.");
    
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    // 4️⃣ GARANTIR ESCOLA ID 2 (Base do Sistema)
    const [escola] = await db.Escola.findOrCreate({
      where: { id: 2 },
      defaults: { 
        id: 2, 
        nome: "Escola de Dança Base", 
        email: "contato@base.com",
        status: "ATIVO" 
      }
    });

    // 5️⃣ GARANTIR USUÁRIO ADMIN VINCULADO
    const adminEmail = "valdemir.marques1925@gmail.com";
    const user = await db.User.findOne({ where: { email: adminEmail } });
    
    if (!user) {
      const hash = await bcrypt.hash("Gestao@danca202558", 10);
      await db.User.create({
        nome: "Valdemir Admin",
        email: adminEmail,
        password: hash,
        perfil: "SUPER_ADMIN",
        escolaId: 2
      });
      console.log("👤 Admin criado com sucesso.");
    } else {
      // Garante que o Admin existente pertença à Escola 2 para ver os dados
      await user.update({ escolaId: 2 });
      console.log("👤 Admin verificado e vinculado à Escola 2.");
    }

    app.listen(PORT, () => {
      console.log("--------------------------------------------------");
      console.log(`🚀 SERVIDOR ONLINE: https://api-gestao-danca.onrender.com`);
      console.log("--------------------------------------------------");
    });

  } catch (err) {
    console.error("❌ Erro fatal no bootstrap:", err.message);
    // Mantém o processo vivo para o Render não dar erro de boot
    if (!app.listening) app.listen(PORT);
  }
}

bootstrap();