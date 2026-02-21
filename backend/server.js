const express = require("express");
const cors = require("cors");
const db = require("./models");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();

// ✅ Configuração de CORS - Liberado para evitar bloqueios no frontend
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
// 🛠️ INICIALIZAÇÃO, REPARO DE VIEW E SYNC
// ===============================================
const PORT = process.env.PORT || 10000;

async function bootstrap() {
  try {
    console.log("📡 Conectando ao MySQL...");
    await db.sequelize.authenticate();
    console.log("✅ Conexão estabelecida com sucesso.");

    // 1️⃣ REMOVER VIEW INVÁLIDA (Corrige o erro ER_VIEW_INVALID)
    // Isso apaga a "tabela virtual" que está impedindo o Sequelize de ler a tabela real de professores.
    console.log("🧹 Limpando metadados antigos...");
    await db.sequelize.query('DROP VIEW IF EXISTS professor');
    
    // 2️⃣ SINCRONIZAÇÃO SEGURA
    // 'alter: true' ajusta as colunas sem apagar os dados que você já cadastrou.
    await db.sequelize.sync({ alter: true });
    console.log("✅ Tabelas sincronizadas e preservadas.");

    // 3️⃣ GARANTIR ESCOLA ID 2
    await db.Escola.findOrCreate({
      where: { id: 2 },
      defaults: {
        id: 2,
        nome: "Escola de Dança Base",
        email: "contato@base.com",
        status: "ATIVO"
      }
    });

    // 4️⃣ GARANTIR VÍNCULO DO ADMIN COM A ESCOLA 2
    const adminEmail = "valdemir.marques1925@gmail.com";
    const user = await db.User.findOne({ where: { email: adminEmail } });
    
    if (user && user.escolaId !== 2) {
      await user.update({ escolaId: 2 });
      console.log("👤 Usuário Admin vinculado corretamente à Escola ID 2.");
    }

    app.listen(PORT, () => {
      console.log("--------------------------------------------------");
      console.log(`🚀 SERVIDOR RODANDO: https://api-gestao-danca.onrender.com`);
      console.log("--------------------------------------------------");
    });

  } catch (err) {
    console.error("❌ Erro fatal no bootstrap:", err.message);
    // Tenta manter o servidor ativo para o Render não derrubar o serviço
    if (!app.listening) app.listen(PORT);
  }
}

bootstrap();