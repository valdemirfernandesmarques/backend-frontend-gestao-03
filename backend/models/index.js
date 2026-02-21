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
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// --- IMPORTAÇÃO DOS MODELS ---
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

// ==========================================
// 🚀 ASSOCIAÇÕES FORÇADAS (SOLUÇÃO DO ERRO)
// ==========================================

// 1. MATRICULA <-> ALUNO (O que estava dando erro 500)
db.Matricula.belongsTo(db.Aluno, { foreignKey: "alunoId", as: "aluno" });
db.Aluno.hasMany(db.Matricula, { foreignKey: "alunoId", as: "matriculas" });

// 2. MATRICULA <-> TURMA
db.Matricula.belongsTo(db.Turma, { foreignKey: "turmaId", as: "turma" });
db.Turma.hasMany(db.Matricula, { foreignKey: "turmaId", as: "matriculas" });

// 3. MENSALIDADE <-> MATRICULA
db.Mensalidade.belongsTo(db.Matricula, { foreignKey: "matriculaId", as: "matricula" });
db.Matricula.hasMany(db.Mensalidade, { foreignKey: "matriculaId", as: "mensalidades" });

// 4. TURMA <-> PROFESSOR / MODALIDADE
db.Turma.belongsTo(db.Professor, { foreignKey: "professorId", as: "professor" });
db.Turma.belongsTo(db.Modalidade, { foreignKey: "modalidadeId", as: "modalidade" });

// 5. RELAÇÕES COM ESCOLA (Essencial para o multi-unidade)
const modelosComEscola = [
  "Aluno", "Professor", "Funcionario", "Turma", 
  "Matricula", "Mensalidade", "Venda", "LancamentoFinanceiro"
];
modelosComEscola.forEach(model => {
  if (db[model]) {
    db[model].belongsTo(db.Escola, { foreignKey: "escolaId", as: "escola" });
  }
});

module.exports = db;