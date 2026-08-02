// backend/models/comissao.js
module.exports = (sequelize, DataTypes) => {
  const Comissao = sequelize.define(
    'Comissao',
    {
      professorId: {
        type: DataTypes.INTEGER,
        allowNull: true, // 👈 CORRIGIDO: Deve ser true para permitir onDelete: 'SET NULL'
        references: {
          model: 'Professors', // ou 'professor' dependendo do nome da tabela no MySQL
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
      tableName: 'Comissaos'
    }
  );

  Comissao.associate = (models) => {
    Comissao.belongsTo(models.Professor, { 
      as: 'professor', 
      foreignKey: 'professorId',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
    
    Comissao.belongsTo(models.Pagamento, { 
      as: 'pagamento', 
      foreignKey: 'pagamentoId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };

  return Comissao;
};