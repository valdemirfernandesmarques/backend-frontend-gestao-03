// arquivo: backend/models/funcionario.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Funcionario extends Model {
    static associate(models) {
      // Um funcionário pertence a uma escola
      Funcionario.belongsTo(models.Escola, {
        foreignKey: 'escolaId',
        as: 'escola'
      });
    }
  }

  Funcionario.init({
    // --- Campos principais ---
    nomeCompleto: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nomeSocial: {
      type: DataTypes.STRING,
      allowNull: true
    },
    escolaId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    // --- Campos pessoais ---
    dataNascimento: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    nacionalidade: {
      type: DataTypes.STRING,
      allowNull: true
    },
    naturalidade: {
      type: DataTypes.STRING,
      allowNull: true
    },
    estadoCivil: {
      type: DataTypes.STRING,
      allowNull: true
    },
    genero: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cpf: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true
    },
    rg: {
      type: DataTypes.STRING,
      allowNull: true
    },
    telefone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
      validate: { isEmail: true }
    },

    // --- Endereço e dados profissionais ---
    endereco: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cargo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    departamento: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dataAdmissao: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    salario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Funcionario',
    tableName: 'funcionarios', // Garante o nome correto da tabela
    timestamps: true
  });

  return Funcionario;
};
