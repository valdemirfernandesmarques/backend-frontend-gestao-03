module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      perfil: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'ADMIN_ESCOLA',
      },
      escolaId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'users', // Força o Sequelize a usar a tabela em minúsculo do seu banco Clever Cloud
      timestamps: true,   // Mantém createdAt e updatedAt
    }
  );

  return User;