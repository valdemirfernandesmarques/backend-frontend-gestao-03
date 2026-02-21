const express = require("express");
const cors = require("cors");
const db = require("./models");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();

// ✅ Configuração de CORS - Liberado para evitar bloqueios no navegador
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ===============================================
// 🚀 IMPORTAÇÃO DE TODAS AS ROTAS
// ===============================================
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

// ===============================================
// 🛣️ REGISTRO DAS ROTAS NO APP
// ===============================================
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
// 🛠️ PROCEDIMENTO DE REPARO E BOOTSTRAP
// ===============================================
const PORT = process.env.PORT || 10000;

async function bootstrap() {
  try {
    console.log("🛠️ Iniciando conexão e reparo do banco...");
    await db.sequelize.authenticate();

    // 1️⃣ Desativar checagem de chaves para limpar tabelas corrompidas
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // 2️⃣ Forçar recriação (Resolve Erro de coluna 'horarioInicio' e Erro 'Failed to open table')
    // Nota: Isso limpa os dados para garantir que a estrutura nova funcione.
    await db.sequelize.sync({ force: true }); 
    
    // 3️⃣ Reativar checagem de chaves
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log("✅ Banco de dados reconstruído e estruturado corretamente.");

    // 4️⃣ Criar Escola ID 2 (Evita erro 404 e erro de Chave Estrangeira na Modalidade)
    await db.Escola.create({
      id: 2,
      nome: "Escola de Dança Base",
      email: "contato@base.com",
      status: "ATIVO"
    });

    // 5️⃣ Criar seu Usuário Admin vinculado à Escola 2
    const adminEmail = "valdemir.marques1925@gmail.com";
    const passwordHash = await bcrypt.hash("Gestao@danca202558", 10);
    
    await db.User.create({
      nome: "Super Admin",
      email: adminEmail,
      password: passwordHash,
      perfil: "SUPER_ADMIN",
      escolaId: 2
    });

    console.log("👤 Dados de acesso restaurados (Escola 2 + Admin).");

    app.listen(PORT, () => {
      console.log(`🚀 SERVIDOR REPARADO: https://api-gestao-danca.onrender.com`);
    });

  } catch (err) {
    console.error("❌ Erro fatal no bootstrap:", err.message);
    // Mantém o app vivo para o Render não dar erro de porta
    if (!app.listening) app.listen(PORT);
  }
}

bootstrap();