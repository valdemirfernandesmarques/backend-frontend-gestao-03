const express = require("express");
const cors = require("cors");
const db = require("./models");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();

// ✅ CORS TOTALMENTE LIBERADO PARA DESTRAVAR O FRONTEND
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ===============================================
// 🚀 IMPORTAÇÃO DAS ROTAS (ESTRUTURA COMPLETA)
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
// 🛣️ REGISTRO DAS ROTAS
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
// 🛠️ SCRIPT DE REPARO E INICIALIZAÇÃO
// ===============================================
const PORT = process.env.PORT || 10000;

async function bootstrap() {
  try {
    console.log("🛠️ Iniciando Reparo de Emergência no Banco...");
    await db.sequelize.authenticate();

    // 1️⃣ Forçar desativação de chaves estrangeiras (mata o erro 'Failed to open table')
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // 2️⃣ Forçar recriação completa (LIMPA O BANCO E CORRIGE ESTRUTURA)
    await db.sequelize.sync({ force: true }); 
    
    // 3️⃣ Reativar chaves
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log("✅ Banco de dados reconstruído do zero.");

    // 4️⃣ Criar Escola com ID 2 (necessário para o seu frontend atual)
    await db.Escola.create({
      id: 2,
      nome: "Escola de Dança Principal",
      email: "contato@base.com",
      status: "ATIVO"
    });

    // 5️⃣ Criar Usuário Admin vinculado à Escola 2
    const hash = await bcrypt.hash("Gestao@danca202558", 10);
    await db.User.create({
      nome: "Valdemir Admin",
      email: "valdemir.marques1925@gmail.com",
      password: hash,
      perfil: "SUPER_ADMIN",
      escolaId: 2
    });

    console.log("👤 Acesso Restaurado: valdemir.marques1925@gmail.com / Gestao@danca202558");

    app.listen(PORT, () => {
      console.log(`🚀 SISTEMA ONLINE NA PORTA ${PORT}`);
    });

  } catch (err) {
    console.error("❌ Erro Crítico:", err.message);
    // Tenta manter o servidor vivo mesmo com erro
    if (!app.listening) app.listen(PORT);
  }
}

bootstrap();