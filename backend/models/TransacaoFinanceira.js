// backend/models/TransacaoFinanceira.js
module.exports = (sequelize, DataTypes) => {
  const TransacaoFinanceira = sequelize.define(
    'TransacaoFinanceira',
    {
      escolaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      pagamentoId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      valorBruto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      percentualPlataforma: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 1.3, // percentual padrão
      },

      valorPlataforma: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },

      valorEscola: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },

      isencaoAplicada: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      gateway: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'PAGARME_EXEMPLO', // ⚠️ EXEMPLO — poderá ser trocado futuramente
      },

      gatewayTransactionId: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      status: {
        type: DataTypes.ENUM('PENDENTE', 'PROCESSADO', 'ESTORNADO'),
        allowNull: false,
        defaultValue: 'PENDENTE',
      },

      dataProcessamento: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },

      metadata: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      tableName: 'transacoes_financeiras',
      timestamps: true,
    }
  );

  TransacaoFinanceira.associate = (models) => {
    TransacaoFinanceira.belongsTo(models.Escola, {
      foreignKey: 'escolaId',
      as: 'escola',
    });

    TransacaoFinanceira.belongsTo(models.Pagamento, {
      foreignKey: 'pagamentoId',
      as: 'pagamento',
    });
  };

  return TransacaoFinanceira;
};
