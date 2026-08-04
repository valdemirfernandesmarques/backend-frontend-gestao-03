'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Funcionarios', 'dataNascimento', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
    await queryInterface.addColumn('Funcionarios', 'cpf', {
      type: Sequelize.STRING,
      unique: true,
    });
    await queryInterface.addColumn('Funcionarios', 'rg', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('Funcionarios', 'genero', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('Funcionarios', 'estadoCivil', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('Funcionarios', 'nacionalidade', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('Funcionarios', 'naturalidade', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('Funcionarios', 'nomeMae', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('Funcionarios', 'nomePai', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('Funcionarios', 'email', {
      type: Sequelize.STRING,
      unique: true,
    });
    await queryInterface.addColumn('Funcionarios', 'telefone', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('Funcionarios', 'endereco', {
      type: Sequelize.TEXT,
    });
    await queryInterface.addColumn('Funcionarios', 'cargo', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('Funcionarios', 'departamento', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('Funcionarios', 'dataAdmissao', {
      type: Sequelize.DATEONLY,
    });
    await queryInterface.addColumn('Funcionarios', 'salario', {
      type: Sequelize.DECIMAL(10, 2),
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Funcionarios', 'salario');
    await queryInterface.removeColumn('Funcionarios', 'dataAdmissao');
    await queryInterface.removeColumn('Funcionarios', 'departamento');
    await queryInterface.removeColumn('Funcionarios', 'cargo');
    await queryInterface.removeColumn('Funcionarios', 'endereco');
    await queryInterface.removeColumn('Funcionarios', 'telefone');
    await queryInterface.removeColumn('Funcionarios', 'email');
    await queryInterface.removeColumn('Funcionarios', 'nomePai');
    await queryInterface.removeColumn('Funcionarios', 'nomeMae');
    await queryInterface.removeColumn('Funcionarios', 'rg');
    await queryInterface.removeColumn('Funcionarios', 'cpf');
    await queryInterface.removeColumn('Funcionarios', 'genero');
    await queryInterface.removeColumn('Funcionarios', 'estadoCivil');
    await queryInterface.removeColumn('Funcionarios', 'naturalidade');
    await queryInterface.removeColumn('Funcionarios', 'nacionalidade');
    await queryInterface.removeColumn('Funcionarios', 'dataNascimento');
  }
};