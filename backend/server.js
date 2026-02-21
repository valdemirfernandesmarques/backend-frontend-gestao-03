const express = require("express");
const cors = require("cors");
const db = require("./models");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();

// ===============================
// ✅ CONFIGURAÇÃO DE CORS (Segurança para o Frontend)
// ===============================
app.use(cors({
  origin: [
    "https://gestaoemdanca.com.br", 
    "https://www.gestaoemdanca.com.br",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ===============================
// ===== IMPORTAÇÃO DAS ROTAS =====
// ===============================
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const ativacaoRoutes = require("./routes/ativacaoRoutes");
const recuperarSenhaRoutes = require("./routes/recuperarSenhaRoutes");
const escolaRoutes = require("./routes/escolaRoutes");
const produtoRoutes = require("./routes/produtoRoutes");
const vendaRoutes = require("./routes/vendaRoutes");
const relatorioRoutes = require("./routes/relatorioRoutes");
const modalidadeRoutes = require("./routes/modalidadeRoutes");
const mensalidadeRoutes = require("./routes/mensalidadeRoutes");
const alunoRoutes = require("./routes/alunoRoutes");
const professorRoutes = require("./routes/professorRoutes");
const turmaRoutes = require("./routes/turmaRoutes");
const matriculaRoutes = require("./routes/matriculaRoutes");
const pagamentoRoutes = require("./routes/pagamentoRoutes");
const funcionarioRoutes = require("./routes/funcionarioRoutes");
const professorModalidadeRoutes = require("./routes/professorModalidadeRoutes");
const comissaoRoutes = require("./routes/comissaoRoutes");
const isencaoTaxaRoutes = require("./routes/isencaoTaxaRoutes");
const financeiroRoutes = require("./routes/financeiroRoutes");
const webhookRoutes = require("./routes/webhookRoutes");
const superAdminDashboardRoutes = require("./routes/superAdminDashboardRoutes");
const transacoesFinanceirasRoutes = require("./routes/transacoesFinanceirasRoutes");

// ===============================
// ===== REGISTRO DAS ROTAS =====
// ===============================
app.use("/api/ativacao", ativacaoRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/auth", recuperarSenhaRoutes);
app.use("/api/users", userRoutes);
app.use("/api/escolas", escolaRoutes);
app.use("/api/produtos", produtoRoutes);
app.use("/api/vendas", vendaRoutes);
app.use("/api/relatorios", relatorioRoutes);
app.use("/api/modalidades", modalidadeRoutes);
app.use("/api/mensalidades", mensalidadeRoutes);
app.use("/api/alunos", alunoRoutes);
app.use("/api/professores", professorRoutes);
app.use("/api/turmas", turmaRoutes);
app.use("/api/matriculas", matriculaRoutes);
app.use("/api/pagamentos", pagamentoRoutes);
app.use("/api/funcionarios", funcionarioRoutes);
app.use("/api/professor-modalidade", professorModalidadeRoutes);
app.use("/api/comissoes", comissaoRoutes);
app.use("/api/isencao-taxa", isencaoTaxaRoutes);
app.use("/api/financeiro", financeiroRoutes);
app.use("/api/webhook", webhookRoutes);
app.use("/api/super", superAdminDashboardRoutes);
app.use("/api/super/transacoes-financeiras", transacoesFinanceirasRoutes);

// ===============================================
// 🔥 MANUTENÇÃO FORÇADA: CRIAÇÃO DE COLUNAS SQL
// ===============================================
async function garantirEstruturaSQL() {
  try {
    console.log("🛠️ Verificando integridade das colunas via SQL Puro...");
    
    // Adiciona colunas se não existirem (MySQL 8.0+ syntax ou fallback manual)
    const queries = [
      "ALTER TABLE modalidades ADD COLUMN IF NOT EXISTS descricao TEXT AFTER nome;",
      "ALTER TABLE modalidades ADD COLUMN IF NOT EXISTS precoAula DECIMAL(10,2) AFTER descricao;",
      "ALTER TABLE turmas ADD COLUMN IF NOT EXISTS horarioInicio TIME AFTER nome;",
      "ALTER TABLE turmas ADD COLUMN IF NOT EXISTS horarioFim TIME AFTER horarioInicio;",
      "ALTER TABLE modalidades ADD COLUMN IF NOT EXISTS createdAt DATETIME DEFAULT CURRENT_TIMESTAMP;",
      "ALTER TABLE modalidades ADD COLUMN IF NOT EXISTS updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;"
    ];

    for (const query of queries) {
      try {
        await db.sequelize.query(query);
      } catch (e) {
        // Ignora erro se a coluna já existir
      }
    }
    console.log("✅ Colunas verificadas/criadas.");
  } catch (err) {
    console.error("❌ Erro na manutenção SQL:", err.message);
  }
}

// ===============================================
// ===== INICIALIZAÇÃO DO SERVIDOR =====
// ===============================================
const PORT = process.env.PORT || 10000;

async function bootstrap() {
  try {
    // 1. Conecta ao Banco
    await db.sequelize.authenticate();
    console.log("📡 Banco de dados conectado com sucesso.");

    // 2. Sincroniza sem deletar dados (Usa o alter para tentar ajustar modelos)
    await db.sequelize.sync({ force: false, alter: true });

    // 3. Roda os comandos SQL de segurança para colunas específicas
    await garantirEstruturaSQL();

    // 4. Garante que o Super Admin existe
    const adminEmail = "valdemir.marques1925@gmail.com";
    const adminPass = "Gestao@danca202558";
    const hash = await bcrypt.hash(adminPass, 10);
    
    await db.User.findOrCreate({
      where: { email: adminEmail },
      defaults: {
        nome: "Super Admin",
        email: adminEmail,
        password: hash,
        perfil: "SUPER_ADMIN",
        escolaId: null
      }
    });

    // 5. Inicia o App
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em: https://api-gestao-danca.onrender.com`);
      console.log(`🌍 Frontend autorizado: gestaoemdanca.com.br`);
    });

  } catch (err) {
    console.error("❌ Falha crítica no bootstrap:", err.message);
    app.listen(PORT);
  }
}

bootstrap();