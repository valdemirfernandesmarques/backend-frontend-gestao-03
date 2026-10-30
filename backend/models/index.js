// backend/models/index.js
const { Sequelize, DataTypes } = require("sequelize");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Função auxiliar para importar arquivos independente de maiúsculas/minúsculas (Linux/Render)
function requireModelSafely(modelName) {
  const files = fs.readdirSync(__dirname);
  const matchedFile = files.find(
    (file) => file.toLowerCase() === `${modelName.toLowerCase()}.js`
  );

  if (matchedFile) {
    return require(path.join(__dirname, matchedFile));
  }
  // Fallback padrão caso não encontre
  return require(`./${modelName}`);
}

// ===============================
// CONEXÃO COM BANCO (AIVEN CLOUD / LOCAL)
// ===============================
const sequelize = new Sequelize(
  process.env.DB_NAME || "gestao_danca",
  process.env.DB_USER || "root",
  process.env.DB_PASS !== undefined ? process.env.DB_PASS : "",
  {
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false,
    timezone: "-03:00",
    dialectOptions: process.env.DB_HOST
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false, // Necessário para aceitar o certificado SSL da Aiven Cloud
          },
        }
      : {},
  }
);

sequelize
  .authenticate()
  .then(() => console.log("Conexão com MySQL (Aiven) OK!"))
  .catch((err) => console.error("Erro de conexão com MySQL:", err));

// ===============================
// OBJETO DB
// ===============================
const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// ===============================
// MODELS
// ===============================
db.Escola = requireModelSafely("Escola")(sequelize, DataTypes);
db.User = requireModelSafely("User")(sequelize, DataTypes);

// 🔐 RECUPERAÇÃO DE SENHA
db.PasswordResetToken = requireModelSafely("PasswordResetToken")(sequelize, DataTypes);

db.Aluno = requireModelSafely("Aluno")(sequelize, DataTypes);
db.Professor = requireModelSafely("Professor")(sequelize, DataTypes);
db.Funcionario = requireModelSafely("Funcionario")(sequelize, DataTypes);

db.Modalidade = requireModelSafely("Modalidade")(sequelize, DataTypes);
db.Turma = requireModelSafely("Turma")(sequelize, DataTypes);

db.Matricula = requireModelSafely("Matricula")(sequelize, DataTypes);
db.Mensalidade = requireModelSafely("Mensalidade")(sequelize, DataTypes);

db.Pagamento = requireModelSafely("Pagamento")(sequelize, DataTypes);

// FINANCEIRO
db.LancamentoFinanceiro = requireModelSafely("LancamentoFinanceiro")(sequelize, DataTypes);
db.Comissao = requireModelSafely("Comissao")(sequelize, DataTypes);

// VENDAS
db.Produto = requireModelSafely("Produto")(sequelize, DataTypes);
db.Venda = requireModelSafely("Venda")(sequelize, DataTypes);
db.VendaItem = requireModelSafely("VendaItem")(sequelize, DataTypes);

// RELAÇÕES
db.ProfessorModalidade = requireModelSafely("ProfessorModalidade")(sequelize, DataTypes);

// SUPER_ADMIN
db.IsencaoTaxa = requireModelSafely("IsencaoTaxa")(sequelize, DataTypes);
db.TransacaoFinanceira = requireModelSafely("TransacaoFinanceira")(sequelize, DataTypes);

// ===============================
// ASSOCIAÇÕES
// ===============================
Object.keys(db).forEach((modelName) => {
  if (db[modelName] && db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;