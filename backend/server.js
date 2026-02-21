const express = require("express");
const cors = require("cors");
const db = require("./models");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();

// ✅ CORS configurado para seu domínio e local
app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ===== IMPORTAÇÃO DAS ROTAS =====
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

// ===== REGISTRO DAS ROTAS =====
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
// 🛠️ INICIALIZAÇÃO E REPARO DE DADOS
// ===============================================
const PORT = process.env.PORT || 10000;

async function bootstrap() {
  try {
    await db.sequelize.authenticate();
    console.log("📡 Conexão com MySQL estabelecida.");

    // Sincroniza sem apagar dados atuais
    await db.sequelize.sync({ alter: true });
    console.log("✅ Tabelas sincronizadas.");

    // 1️⃣ GARANTIR QUE A ESCOLA ID 2 EXISTA
    // Isso evita o erro de Chave Estrangeira (ForeignKeyConstraintError)
    const [escola] = await db.Escola.findOrCreate({
      where: { id: 2 },
      defaults: {
        id: 2,
        nome: "Escola de Dança Principal",
        email: "contato@gestaoemdanca.com.br",
        status: "ATIVO"
      }
    });
    console.log("🏫 Verificação de Escola ID 2: OK.");

    // 2️⃣ GARANTIR QUE O SEU USUÁRIO EXISTA E ESTEJA NA ESCOLA 2
    const adminEmail = "valdemir.marques1925@gmail.com";
    const passwordHash = await bcrypt.hash("Gestao@danca202558", 10);

    const [user, created] = await db.User.findOrCreate({
      where: { email: adminEmail },
      defaults: {
        nome: "Valdemir Admin",
        email: adminEmail,
        password: passwordHash,
        perfil: "SUPER_ADMIN",
        escolaId: 2 // Vincula você à escola 2 para que suas criações funcionem
      }
    });

    // Se o usuário já existia mas estava sem escolaId, atualizamos agora
    if (!created && user.escolaId !== 2) {
      await user.update({ escolaId: 2 });
      console.log("👤 Usuário atualizado para Escola ID 2.");
    } else if (created) {
      console.log("👤 Usuário Super Admin criado e vinculado à Escola 2.");
    }

    app.listen(PORT, () => {
      console.log("--------------------------------------------------");
      console.log(`🚀 SERVIDOR ONLINE NA PORTA ${PORT}`);
      console.log("--------------------------------------------------");
    });

  } catch (err) {
    console.error("❌ Erro no bootstrap:", err.message);
    app.listen(PORT);
  }
}

bootstrap();