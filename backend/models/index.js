// backend/models/index.js
const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

// ===============================
// ✅ CONEXÃO COM BANCO (AJUSTADA PARA RENDER/AIVEN)
// ===============================
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false,
    timezone: "-03:00",
    // 🛡️ Configuração obrigatória para bancos na nuvem (Aiven/DigitalOcean)
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

sequelize
  .authenticate()
  .then(() => console.log("📡 Conexão com MySQL (Aiven SSL) OK!"))
  .catch((err) => console.error("❌ Erro de conexão no Sequelize:", err));

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