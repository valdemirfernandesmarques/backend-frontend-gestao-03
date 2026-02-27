module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    perfil: {
      type: DataTypes.ENUM("SUPER_ADMIN", "ADMIN_ESCOLA", "USUARIO"),
      defaultValue: "USUARIO"
    },
    escolaId: { type: DataTypes.INTEGER, allowNull: true },
    resetPasswordToken: { type: DataTypes.STRING, allowNull: true },
    resetPasswordExpires: { type: DataTypes.DATE, allowNull: true }
  }, {
    tableName: 'users',
    freezeTableName: true,
    timestamps: true
  });

  User.associate = (models) => {
    if (models.Escola) {
      User.belongsTo(models.Escola, { foreignKey: "escolaId", as: "escola" });
    }
  };

  return User;
};