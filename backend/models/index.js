const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  dialect: "mysql",
  logging: false,
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
});

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Importar Modelos
db.Escola = require("./Escola")(sequelize, DataTypes);
db.Aluno = require("./Aluno")(sequelize, DataTypes);
db.Professor = require("./Professor")(sequelize, DataTypes);
db.Modalidade = require("./Modalidade")(sequelize, DataTypes);
db.Turma = require("./Turma")(sequelize, DataTypes);
db.Matricula = require("./Matricula")(sequelize, DataTypes);
db.Mensalidade = require("./Mensalidade")(sequelize, DataTypes);
db.Funcionario = require("./Funcionario")(sequelize, DataTypes);
db.ProfessorModalidade = require("./ProfessorModalidade")(sequelize, DataTypes);

// --- ASSOCIAÇÕES ---

// Aluno / Turma / Matricula
db.Matricula.belongsTo(db.Aluno, { foreignKey: "alunoId", as: "aluno" });
db.Matricula.belongsTo(db.Turma, { foreignKey: "turmaId", as: "turma" });

// Professor / Modalidade (O que resolve o erro 500 de professores)
db.Professor.belongsToMany(db.Modalidade, { 
  through: db.ProfessorModalidade, 
  foreignKey: "professorId",
  as: "modalidades" 
});
db.Modalidade.belongsToMany(db.Professor, { 
  through: db.ProfessorModalidade, 
  foreignKey: "modalidadeId",
  as: "professores" 
});

// Mensalidade
db.Mensalidade.belongsTo(db.Matricula, { foreignKey: "matriculaId", as: "matricula" });

module.exports = db;