module.exports = (sequelize, DataTypes) => {
  const IsencaoTaxa = sequelize.define(
    'IsencaoTaxa',
    {
      escolaId: {
        type: DataTypes.INTEGER,
        allowNull: true, // null = todas as escolas
      },
      tipoTaxa: {
        type: DataTypes.ENUM('PLATAFORMA'),
        allowNull: false,
        defaultValue: 'PLATAFORMA',
      },
      dataInicio: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      dataFim: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      motivo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      criadoPor: {
        type: DataTypes.INTEGER,
        allowNull: false, // id do SUPER_ADMIN
      },
    },
    {
      tableName: 'isencoes_taxa',
      timestamps: true,
    }
  );

  IsencaoTaxa.associate = (models) => {
    IsencaoTaxa.belongsTo(models.Escola, {
      foreignKey: 'escolaId',
      as: 'escola',
    });
  };

  return IsencaoTaxa;
};
