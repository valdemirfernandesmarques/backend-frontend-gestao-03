const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 13908,
    dialect: "mysql",
    logging: false,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    }
  }
);

const db = {};

db.Escola = require("./models/Escola")(sequelize, DataTypes);
db.Aluno = require("./models/Aluno")(sequelize, DataTypes);
db.Professor = require("./models/Professor")(sequelize, DataTypes);
db.Funcionario = require("./models/Funcionario")(sequelize, DataTypes);
db.Modalidade = require("./models/Modalidade")(sequelize, DataTypes);
db.Turma = require("./models/Turma")(sequelize, DataTypes);
db.Matricula = require("./models/Matricula")(sequelize, DataTypes);
db.Mensalidade = require("./models/Mensalidade")(sequelize, DataTypes);
db.ProfessorModalidade = require("./models/ProfessorModalidade")(sequelize, DataTypes);
db.User = require("./models/User")(sequelize, DataTypes);
db.TransacaoFinanceira = require("./models/TransacaoFinanceira")(sequelize, DataTypes);
db.Venda = require("./models/Venda")(sequelize, DataTypes);
db.VendaItem = require("./models/VendaItem")(sequelize, DataTypes);

Object.keys(db).forEach((modelName) => {
  if (db[modelName] && db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;