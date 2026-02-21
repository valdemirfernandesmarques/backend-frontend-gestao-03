const express = require("express");
const cors = require("cors");
const db = require("./models");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();

// ✅ CORS TOTALMENTE LIBERADO
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
// 🛠️ SCRIPT DE LIMPEZA PROFUNDA E BOOTSTRAP
// ===============================================
const PORT = process.env.PORT || 10000;

async function bootstrap() {
  try {
    console.log("🛠️ Iniciando Limpeza Profunda...");
    await db.sequelize.authenticate();

    // 1️⃣ Matar a VIEW que está bloqueando a tabela de professores
    // O erro 'ER_VIEW_INVALID' acontece porque existe uma view 'professor' que impede a criação da tabela 'professor'
    await db.sequelize.query('DROP VIEW IF EXISTS professor');
    await db.sequelize.query('DROP TABLE IF EXISTS professor'); // Limpa se houver tabela mal formada
    
    // 2️⃣ Desativar checagem para forçar a correção das colunas (como horarioInicio)
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // 3️⃣ Sincronizar (Isso vai criar a coluna horarioInicio na tabela Turmas)
    await db.sequelize.sync({ alter: true });
    
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log("✅ Banco de dados limpo e colunas atualizadas.");

    // 4️⃣ Garantir que a Escola 2 existe
    await db.Escola.findOrCreate({
      where: { id: 2 },
      defaults: { id: 2, nome: "Escola de Dança Base", email: "contato@base.com", status: "ATIVO" }
    });

    // 5️⃣ Garantir Usuário Admin
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
    } else {
      await user.update({ escolaId: 2 });
    }

    app.listen(PORT, () => {
      console.log(`🚀 SERVIDOR RODANDO EM: https://api-gestao-danca.onrender.com`);
    });

  } catch (err) {
    console.error("❌ Erro fatal no bootstrap:", err.message);
    if (!app.listening) app.listen(PORT);
  }
}

bootstrap();