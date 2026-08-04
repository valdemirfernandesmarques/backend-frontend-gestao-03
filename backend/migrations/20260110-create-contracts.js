'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('contracts', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      escolaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'escolas',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },

      status: {
        type: Sequelize.ENUM('TRIAL', 'ACTIVE', 'SUSPENDED'),
        allowNull: false,
        defaultValue: 'TRIAL',
      },

      modo: {
        type: Sequelize.ENUM('TEST', 'PROD'),
        allowNull: false,
        defaultValue: 'TEST',
      },

      taxaPercentual: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 1.30,
        comment: 'Percentual de taxa aplicado após o trial',
      },

      trialEndsAt: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Data final do período de trial',
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('contracts');
  },
};
