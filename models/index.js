const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

// Configuração da conexão com o TiDB Cloud
const sequelize = new Sequelize(
  process.env.DB_NAME || "gestao_danca",
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 4000,
    dialect: "mysql",
    logging: false,
    define: {
      freezeTableName: true // Garante que o Sequelize não mude o nome das tabelas (ex: users vira users)
    },
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000
    }
  }
);

// Teste de conexão
sequelize
  .authenticate()
  .then(() => console.log(`✅ Conexão com TiDB OK! Banco: ${process.env.DB_NAME || "gestao_danca"}`))
  .catch((err) => console.error("❌ Erro de conexão no Banco:", err.message));

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Importação manual de todos os seus Models
// Certifique-se de que o nome do arquivo .js dentro da pasta models seja idêntico ao que está no require
db.Escola = require("./Escola")(sequelize, DataTypes);
db.User = require("./User")(sequelize, DataTypes);
db.PasswordResetToken = require("./PasswordResetToken")(sequelize, DataTypes);
db.Aluno = require("./Aluno")(sequelize, DataTypes);
db.Professor = require("./Professor")(sequelize, DataTypes);
db.Funcionario = require("./Funcionario")(sequelize, DataTypes);
db.Modalidade = require("./Modalidade")(sequelize, DataTypes);
db.Turma = require("./Turma")(sequelize, DataTypes);
db.Matricula = require("./Matricula")(sequelize, DataTypes);
db.Mensalidade = require("./Mensalidade")(sequelize, DataTypes);
db.Pagamento = require("./Pagamento")(sequelize, DataTypes);
db.LancamentoFinanceiro = require("./LancamentoFinanceiro")(sequelize, DataTypes);
db.Comissao = require("./Comissao")(sequelize, DataTypes);
db.Produto = require("./Produto")(sequelize, DataTypes);
db.Venda = require("./Venda")(sequelize, DataTypes);
db.VendaItem = require("./VendaItem")(sequelize, DataTypes);
db.ProfessorModalidade = require("./ProfessorModalidade")(sequelize, DataTypes);
db.IsencaoTaxa = require("./IsencaoTaxa")(sequelize, DataTypes);
db.TransacaoFinanceira = require("./TransacaoFinanceira")(sequelize, DataTypes);

// Ativar as associações entre os modelos (Relacionamentos)
Object.keys(db).forEach((modelName) => {
  if (db[modelName] && db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;