const express = require("express");
const cors = require("cors");
const db = require("./models");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();

app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], allowedHeaders: ["Content-Type", "Authorization"] }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// --- Importação de Rotas (Mantendo todas as rotas originais) ---
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

// --- Registro das Rotas ---
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

const PORT = process.env.PORT || 10000;

async function bootstrap() {
  try {
    console.log("🛠️ ENGENHARIA: Aplicando correção de integridade...");
    await db.sequelize.authenticate();

    // 1️⃣ DESATIVAR TRAVAS (Crítico para resolver o erro ER_NO_REFERENCED_ROW_2)
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // 2️⃣ LIMPAR VIEW E TABELAS COM ERRO DE COLUNA
    await db.sequelize.query('DROP VIEW IF EXISTS professor');
    // Forçamos a recriação apenas se necessário, mas com 'alter' para não perder tudo
    await db.sequelize.sync({ alter: true });
    
    // 3️⃣ REATIVAR TRAVAS
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log("✅ Banco de dados sincronizado e travas reajustadas.");

    // 4️⃣ GARANTIR ESCOLA 2
    const [escola] = await db.Escola.findOrCreate({ 
        where: { id: 2 }, 
        defaults: { id: 2, nome: "Escola de Dança Base", status: "ATIVO" } 
    });

    // 5️⃣ GARANTIR USUÁRIO ADMIN (Sempre ID fixo se possível para evitar erro em Vendas)
    const adminEmail = "valdemir.marques1925@gmail.com";
    let admin = await db.User.findOne({ where: { email: adminEmail } });
    
    if (!admin) {
        const hash = await bcrypt.hash("Gestao@danca202558", 10);
        admin = await db.User.create({
            nome: "Valdemir Admin",
            email: adminEmail,
            password: hash,
            perfil: "SUPER_ADMIN",
            escolaId: 2
        });
        console.log("👤 Novo Admin criado.");
    } else {
        await admin.update({ escolaId: 2 });
        console.log("👤 Admin existente atualizado.");
    }

    app.listen(PORT, () => {
      console.log(`🚀 SERVIDOR OPERALIZADO: https://api-gestao-danca.onrender.com`);
    });

  } catch (err) {
    console.error("❌ Erro fatal no bootstrap:", err.message);
    if (!app.listening) app.listen(PORT);
  }
}

bootstrap();