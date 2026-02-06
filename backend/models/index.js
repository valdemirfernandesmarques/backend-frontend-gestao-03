// backend/models/index.js
const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

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
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    }
  }
);

sequelize
  .authenticate()
  .then(() => console.log("Conexão com MySQL OK!"))
  .catch((err) => console.error("Erro de conexão no Sequelize:", err));

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// ===============================
// MODELS (TUDO EM MINÚSCULO)
// ===============================
db.Escola = require("./escola")(sequelize, DataTypes);
db.User = require("./user")(sequelize, DataTypes);
db.PasswordResetToken = require("./passwordresettoken")(sequelize, DataTypes);
db.Aluno = require("./aluno")(sequelize, DataTypes);
db.Professor = require("./professor")(sequelize, DataTypes);
db.Funcionario = require("./funcionario")(sequelize, DataTypes);
db.Modalidade = require("./modalidade")(sequelize, DataTypes);
db.Turma = require("./turma")(sequelize, DataTypes);
db.Matricula = require("./matricula")(sequelize, DataTypes);
db.Mensalidade = require("./mensalidade")(sequelize, DataTypes);
db.Pagamento = require("./pagamento")(sequelize, DataTypes);
db.LancamentoFinanceiro = require("./lancamentofinanceiro")(sequelize, DataTypes);
db.Comissao = require("./comissao")(sequelize, DataTypes);
db.Produto = require("./produto")(sequelize, DataTypes);
db.Venda = require("./venda")(sequelize, DataTypes);
db.VendaItem = require("./vendaitem")(sequelize, DataTypes);
db.ProfessorModalidade = require("./professormodalidade")(sequelize, DataTypes);
db.IsencaoTaxa = require("./isencaotaxa")(sequelize, DataTypes);
db.TransacaoFinanceira = require("./transacaofinanceira")(sequelize, DataTypes);

Object.keys(db).forEach((modelName) => {
  if (db[modelName] && db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;