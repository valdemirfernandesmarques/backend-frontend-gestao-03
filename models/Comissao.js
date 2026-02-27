module.exports = (sequelize, DataTypes) => {
  const Comissao = sequelize.define(
    'Comissao',
    {
      professorId: {
        type: DataTypes.INTEGER,
        // Alterado para true para permitir que o MySQL execute o "ON DELETE SET NULL"
        allowNull: true, 
        references: {
          // Importante: Verifique se a sua tabela de professores se chama 'professores' ou 'professor'
          // Se o erro persistir, tente mudar para 'professores' (plural)
          model: 'professor', 
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      pagamentoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Pagamentos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      valor: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      }
    },
    {
      // Mantendo o nome da tabela como o Sequelize está a tentar criar nos logs
      tableName: 'Comissaos'
    }
  );

  Comissao.associate = (models) => {
    // Definindo as associações para que o Sequelize saiba como fazer os JOINs
    Comissao.belongsTo(models.Professor, { 
      as: 'professor', 
      foreignKey: 'professorId' 
    });
    Comissao.belongsTo(models.Pagamento, { 
      as: 'pagamento', 
      foreignKey: 'pagamentoId' 
    });
  };

  return Comissao;
};