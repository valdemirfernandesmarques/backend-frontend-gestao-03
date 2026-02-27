// backend/models/VendaItem.js
module.exports = (sequelize, DataTypes) => {
  const VendaItem = sequelize.define(
    "VendaItem",
    {
      quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      precoUnitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      vendaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      produtoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "vendaitems", // 🔥 FORÇA o nome exato da tabela
      freezeTableName: true,   // 🔥 Impede pluralização automática
    }
  );

  VendaItem.associate = (models) => {
    VendaItem.belongsTo(models.Venda, {
      foreignKey: "vendaId",
      as: "venda",
    });

    VendaItem.belongsTo(models.Produto, {
      foreignKey: "produtoId",
      as: "produto",
    });
  };

  return VendaItem;
};