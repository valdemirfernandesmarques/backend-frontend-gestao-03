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
    // ✅ URL do logotipo da escola
    logoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    // ✅ Força o nome exato da tabela para evitar erros no Linux (Render)
    tableName: 'Escolas', 
    timestamps: true
  });

  Escola.associate = (models) => {
    // Uma escola tem muitas matrículas
    Escola.hasMany(models.Matricula, {
      foreignKey: 'escolaId',
      as: 'matriculas',
    });
    // Uma escola tem muitos usuários (admins, secretários, etc)
    Escola.hasMany(models.User, {
      foreignKey: 'escolaId',
      as: 'usuarios',
    });
    // ✅ Associação com comissões (Importante para o seu cadastro de comissão)
    if (models.Comissao) {
      Escola.hasMany(models.Comissao, {
        foreignKey: 'escolaId',
        as: 'comissoes',
      });
    }
  };

  return Escola;
};