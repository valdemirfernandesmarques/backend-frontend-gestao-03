// backend/models/professor.js
module.exports = (sequelize, DataTypes) => {
  const Professor = sequelize.define('Professor', {
    nome: { type: DataTypes.STRING, allowNull: false },
    cpf: { type: DataTypes.STRING, unique: true, allowNull: false },
    email: { type: DataTypes.STRING, unique: true },
    telefone: { type: DataTypes.STRING },
    endereco: { type: DataTypes.STRING },
    vinculo: { type: DataTypes.ENUM('CLT', 'Autônomo', 'Comissão'), allowNull: false },
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    tableName: 'Professors', // PADRONIZADO PARA PLURAL
    timestamps: true
  });

  Professor.associate = (models) => {
    Professor.belongsTo(models.Escola, { foreignKey: 'escolaId', as: 'escola' });
    Professor.belongsToMany(models.Modalidade, {
      through: models.ProfessorModalidade,
      foreignKey: 'professorId',
      as: 'modalidades'
    });
  };

  return Professor;
};