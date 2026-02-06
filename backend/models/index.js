// backend/models/index.js
const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

// Usando variáveis de ambiente para segurança total
const db_name = process.env.DB_NAME || "defaultdb";
const db_user = process.env.DB_USER || "avnadmin";
const db_host = process.env.DB_HOST || "banco-gestao-gestaoemdanca.j.aivencloud.com";
const db_port = process.env.DB_PORT || 13908;
const db_pass = process.env.DB_PASS; 

const sequelize = new Sequelize(
  db_name,
  db_user,
  db_pass,
  {
    host: db_host,
    port: db_port,
    dialect: "mysql",
    logging: false,
    timezone: "-03:00",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
);

sequelize.authenticate()
  .then(() => console.log("🎯 CONECTADO AO BANCO COM SUCESSO!"))
  .catch(err => {
    console.log("❌ Erro de conexão:", err.message);
  });

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Importação Completa dos Modelos
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