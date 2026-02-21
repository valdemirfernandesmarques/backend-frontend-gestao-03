const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 13908,
    dialect: "mysql",
    logging: false,
    dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
});

const db = {};

// Importação ajustada para garantir a letra inicial MAIÚSCULA
// O Node no Linux exige que o nome aqui seja igual ao nome do arquivo no disco
db.Escola = require("./Escola")(sequelize, DataTypes);
db.Aluno = require("./Aluno")(sequelize, DataTypes);
db.Professor = require("./Professor")(sequelize, DataTypes);
db.Funcionario = require("./Funcionario")(sequelize, DataTypes);
db.Modalidade = require("./Modalidade")(sequelize, DataTypes);
db.Turma = require("./Turma")(sequelize, DataTypes);
db.Matricula = require("./Matricula")(sequelize, DataTypes);
db.Mensalidade = require("./Mensalidade")(sequelize, DataTypes);
db.ProfessorModalidade = require("./ProfessorModalidade")(sequelize, DataTypes);

// Associações com verificação
Object.keys(db).forEach((modelName) => {
    if (db[modelName] && db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;