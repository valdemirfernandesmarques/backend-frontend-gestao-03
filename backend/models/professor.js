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
    // ✅ PADRONIZADO: Nome exato esperado pelas chaves estrangeiras
    tableName: 'Professors',
    timestamps: true
  });

  Professor.associate = (models) => {
    // Um professor pertence a uma escola
    Professor.belongsTo(models.Escola, { foreignKey: 'escolaId', as: 'escola' });
    
    // Relação com Modalidades
    Professor.belongsToMany(models.Modalidade, {
      through: models.ProfessorModalidade,
      foreignKey: 'professorId',
      as: 'modalidades'
    });

    // Relação com Comissões
    Professor.hasMany(models.Comissao, { foreignKey: 'professorId', as: 'comissoes' });
  };

  return Professor;
};