// backend/models/index.js
const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

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
db.Escola = require("./Escola")(sequelize, DataTypes);
db.User = require("./User")(sequelize, DataTypes);

// 🔐 RECUPERAÇÃO DE SENHA
db.PasswordResetToken = require("./PasswordResetToken")(sequelize, DataTypes);

db.Aluno = require("./Aluno")(sequelize, DataTypes);
db.Professor = require("./Professor")(sequelize, DataTypes);
db.Funcionario = require("./Funcionario")(sequelize, DataTypes);

db.Modalidade = require("./Modalidade")(sequelize, DataTypes);
db.Turma = require("./Turma")(sequelize, DataTypes);

db.Matricula = require("./Matricula")(sequelize, DataTypes);
db.Mensalidade = require("./Mensalidade")(sequelize, DataTypes);

db.Pagamento = require("./Pagamento")(sequelize, DataTypes);

// FINANCEIRO
db.LancamentoFinanceiro = require("./LancamentoFinanceiro")(sequelize, DataTypes);
db.Comissao = require("./Comissao")(sequelize, DataTypes);

// VENDAS
db.Produto = require("./Produto")(sequelize, DataTypes);
db.Venda = require("./Venda")(sequelize, DataTypes);
db.VendaItem = require("./VendaItem")(sequelize, DataTypes);

// RELAÇÕES
db.ProfessorModalidade = require("./ProfessorModalidade")(sequelize, DataTypes);

// SUPER_ADMIN
db.IsencaoTaxa = require("./IsencaoTaxa")(sequelize, DataTypes);
db.TransacaoFinanceira = require("./TransacaoFinanceira")(sequelize, DataTypes);

// ===============================
// ASSOCIAÇÕES
// ===============================
Object.keys(db).forEach((modelName) => {
  if (db[modelName] && db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;