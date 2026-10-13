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

// Mapeamento das tabelas conforme seu arquivo SQL (nomes minúsculos)
db.User = require("./user")(sequelize, DataTypes);
db.User.options.tableName = 'users';

db.Escola = require("./escola")(sequelize, DataTypes);
db.Escola.options.tableName = 'escolas';

db.Professor = require("./professor")(sequelize, DataTypes);
db.Professor.options.tableName = 'professor';

db.Aluno = require("./aluno")(sequelize, DataTypes);
db.Aluno.options.tableName = 'alunos';

db.Funcionario = require("./funcionario")(sequelize, DataTypes);
db.Funcionario.options.tableName = 'funcionarios';

db.Modalidade = require("./modalidade")(sequelize, DataTypes);
db.Modalidade.options.tableName = 'modalidades';

db.Produto = require("./produto")(sequelize, DataTypes);
db.Produto.options.tableName = 'produtos';

db.Turma = require("./turma")(sequelize, DataTypes);
db.Turma.options.tableName = 'turmas';

db.Matricula = require("./matricula")(sequelize, DataTypes);
db.Matricula.options.tableName = 'matriculas';

db.Mensalidade = require("./mensalidade")(sequelize, DataTypes);
db.Mensalidade.options.tableName = 'mensalidades';

db.Pagamento = require("./pagamento")(sequelize, DataTypes);
db.Pagamento.options.tableName = 'pagamentos';

db.LancamentoFinanceiro = require("./lancamentofinanceiro")(sequelize, DataTypes);
db.LancamentoFinanceiro.options.tableName = 'lancamentos_financeiros';

db.Comissao = require("./comissao")(sequelize, DataTypes);
db.Comissao.options.tableName = 'comissaos';

db.Venda = require("./venda")(sequelize, DataTypes);
db.Venda.options.tableName = 'vendas';

db.VendaItem = require("./vendaitem")(sequelize, DataTypes);
db.VendaItem.options.tableName = 'vendaitems';

db.ProfessorModalidade = require("./professormodalidade")(sequelize, DataTypes);
db.ProfessorModalidade.options.tableName = 'professores_modalidades';

db.IsencaoTaxa = require("./isencaotaxa")(sequelize, DataTypes);
db.IsencaoTaxa.options.tableName = 'isencoes_taxa';

db.TransacaoFinanceira = require("./transacaofinanceira")(sequelize, DataTypes);
db.TransacaoFinanceira.options.tableName = 'transacoes_financeiras';

db.PasswordResetToken = require("./passwordresettoken")(sequelize, DataTypes);
db.PasswordResetToken.options.tableName = 'password_reset_tokens';

Object.keys(db).forEach((modelName) => {
  if (db[modelName] && db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;