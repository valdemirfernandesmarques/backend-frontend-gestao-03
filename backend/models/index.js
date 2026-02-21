const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

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
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
);

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// --- IMPORTAÇÃO DOS MODELS ---
db.Escola = require("./Escola")(sequelize, DataTypes);
db.Aluno = require("./Aluno")(sequelize, DataTypes);
db.Professor = require("./Professor")(sequelize, DataTypes);
db.Funcionario = require("./Funcionario")(sequelize, DataTypes);
db.Modalidade = require("./Modalidade")(sequelize, DataTypes);
db.Turma = require("./Turma")(sequelize, DataTypes);
db.Matricula = require("./Matricula")(sequelize, DataTypes);
db.Mensalidade = require("./Mensalidade")(sequelize, DataTypes);

// --- ASSOCIAÇÕES MANUAIS (PRECISÃO TOTAL) ---

// Aluno <-> Matricula
db.Matricula.belongsTo(db.Aluno, { foreignKey: "alunoId", as: "aluno" });
db.Aluno.hasMany(db.Matricula, { foreignKey: "alunoId", as: "matriculas" });

// Turma <-> Matricula
db.Matricula.belongsTo(db.Turma, { foreignKey: "turmaId", as: "turma" });
db.Turma.hasMany(db.Matricula, { foreignKey: "turmaId", as: "matriculas" });

// Matricula <-> Mensalidade
db.Mensalidade.belongsTo(db.Matricula, { foreignKey: "matriculaId", as: "matricula" });
db.Matricula.hasMany(db.Mensalidade, { foreignKey: "matriculaId", as: "mensalidades" });

// Turma <-> Professor
db.Turma.belongsTo(db.Professor, { foreignKey: "professorId", as: "professor" });
db.Professor.hasMany(db.Turma, { foreignKey: "professorId", as: "turmas" });

module.exports = db;