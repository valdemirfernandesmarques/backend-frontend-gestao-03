// backend/models/escola.js
module.exports = (sequelize, DataTypes) => {
  const escola = sequelize.define('escola', {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isencaoAtiva: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // ✅ NOVO: Coluna para armazenar a URL do logotipo
    logoUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    }
  });

  escola.associate = (models) => {
    escola.hasMany(models.Matricula, {
      foreignKey: 'escolaId',
      as: 'matriculas',
    });
    escola.hasMany(models.User, {
      foreignKey: 'escolaId',
      as: 'usuarios',
    });
  };

  return escola;
};