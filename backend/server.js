const express = require("express");
const cors = require("cors");
const db = require("./models");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();

// Configuração de CORS e JSON
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], allowedHeaders: ["Content-Type", "Authorization"] }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// --- REGISTRO DE ROTAS (Mantendo integridade total) ---
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
    console.log("🛠️ INICIANDO REPARO ESTRUTURAL...");
    await db.sequelize.authenticate();

    // 1️⃣ Desativar travas de chaves estrangeiras
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // 2️⃣ Tentar injetar as colunas via SQL Puro (isso resolve o erro 1054)
    // Usamos TRY/CATCH individual para cada coluna para não travar se ela já existir
    const columns = ["horarioInicio TIME", "horarioFim TIME", "diaDaSemana VARCHAR(255)"];
    for (const col of columns) {
        try {
            await db.sequelize.query(`ALTER TABLE Turmas ADD COLUMN ${col} NULL;`);
            console.log(`✅ Coluna ${col} adicionada.`);
        } catch (e) {
            console.log(`ℹ️ Coluna ${col.split(' ')[0]} já existe ou ignorada.`);
        }
    }

    // 3️⃣ Sincronizar modelos (alter: true para não apagar dados)
    await db.sequelize.sync({ alter: true });
    
    // 4️⃣ Reativar chaves
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log("✅ Banco de dados estabilizado.");

    // 5️⃣ Garantir Escola e Admin
    await db.Escola.findOrCreate({ where: { id: 2 }, defaults: { id: 2, nome: "Escola Base", status: "ATIVO" } });
    const user = await db.User.findOne({ where: { email: "valdemir.marques1925@gmail.com" } });
    if (user) await user.update({ escolaId: 2 });

    app.listen(PORT, () => {
      console.log(`🚀 SERVIDOR RODANDO: https://api-gestao-danca.onrender.com`);
    });

  } catch (err) {
    console.error("❌ Erro fatal:", err.message);
    if (!app.listening) app.listen(PORT);
  }
}

bootstrap();