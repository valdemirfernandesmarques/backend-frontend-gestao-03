// backend/models/index.js
const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "defaultdb",
  process.env.DB_USER || "avnadmin",
  process.env.DB_PASS, 
  {
    host: process.env.DB_HOST || "banco-gestao-gestaoemdanca.j.aivencloud.com",
    port: 13908,
    dialect: "mysql",
    logging: false,
    timezone: "-03:00",
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
    dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
  }
);

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// ORDEM DE CARREGAMENTO MANUAL RÍGIDA
db.User = require("./user")(sequelize, DataTypes);
db.Escola = require("./escola")(sequelize, DataTypes);
db.Professor = require("./professor")(sequelize, DataTypes); // Professor aqui
db.Aluno = require("./aluno")(sequelize, DataTypes);
db.Funcionario = require("./funcionario")(sequelize, DataTypes);
db.Modalidade = require("./modalidade")(sequelize, DataTypes);
db.Produto = require("./produto")(sequelize, DataTypes);

db.PasswordResetToken = require("./passwordresettoken")(sequelize, DataTypes);
db.Turma = require("./turma")(sequelize, DataTypes);
db.Matricula = require("./matricula")(sequelize, DataTypes);
db.Mensalidade = require("./mensalidade")(sequelize, DataTypes);
db.Pagamento = require("./pagamento")(sequelize, DataTypes);
db.LancamentoFinanceiro = require("./lancamentofinanceiro")(sequelize, DataTypes);
db.Comissao = require("./comissao")(sequelize, DataTypes); // Comissão depende de Professor
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