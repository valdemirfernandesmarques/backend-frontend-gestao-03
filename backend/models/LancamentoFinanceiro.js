module.exports = (sequelize, DataTypes) => {
  const LancamentoFinanceiro = sequelize.define(
    'LancamentoFinanceiro',
    {
      tipo: {
        type: DataTypes.ENUM('ENTRADA', 'SAIDA'),
        allowNull: false
      },
      origem: {
        type: DataTypes.STRING,
        allowNull: false
      },
      descricao: {
        type: DataTypes.STRING,
        allowNull: false
      },
      valor: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      data: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      escolaId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      tableName: 'lancamentos_financeiros',
      timestamps: true
    }
  );

  LancamentoFinanceiro.associate = (models) => {
    LancamentoFinanceiro.belongsTo(models.Escola, {
      foreignKey: 'escolaId',
      as: 'escola'
    });
  };

  return LancamentoFinanceiro;
};
