module.exports = (sequelize, DataTypes) => {
  const Escola = sequelize.define('Escola', {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isencaoAtiva: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    logoUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    }
  }, {
    // ✅ FORÇA o nome da tabela para evitar erros de referência (FK)
    tableName: 'Escolas' 
  });

  Escola.associate = (models) => {
    Escola.hasMany(models.Matricula, {
      foreignKey: 'escolaId',
      as: 'matriculas',
    });
    Escola.hasMany(models.User, {
      foreignKey: 'escolaId',
      as: 'usuarios',
    });
    // Adicione a associação com Transacao se ela existir
    if (models.TransacaoFinanceira) {
      Escola.hasMany(models.TransacaoFinanceira, {
        foreignKey: 'escolaId',
        as: 'transacoes',
      });
    }
  };

  return Escola;
};