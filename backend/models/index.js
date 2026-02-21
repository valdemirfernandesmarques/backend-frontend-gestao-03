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
        rejectUnauthorized: false,
      },
    },
  }
);

const db = {};

db.Escola = require("./Escola")(sequelize, DataTypes);
db.Aluno = require("./Aluno")(sequelize, DataTypes);
db.Professor = require("./Professor")(sequelize, DataTypes);
db.Funcionario = require("./Funcionario")(sequelize, DataTypes);
db.Modalidade = require("./Modalidade")(sequelize, DataTypes);
db.Turma = require("./Turma")(sequelize, DataTypes);
db.Matricula = require("./Matricula")(sequelize, DataTypes);
db.Mensalidade = require("./Mensalidade")(sequelize, DataTypes);
db.ProfessorModalidade = require("./ProfessorModalidade")(sequelize, DataTypes);
db.User = require("./User")(sequelize, DataTypes);
db.TransacaoFinanceira = require("./TransacaoFinanceira")(sequelize, DataTypes);
db.Venda = require("./Venda")(sequelize, DataTypes);
db.VendaItem = require("./VendaItem")(sequelize, DataTypes);

Object.keys(db).forEach((modelName) => {
  if (db[modelName] && db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;