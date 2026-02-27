// backend/config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Criamos a instância do Sequelize com suporte a SSL e Timeouts longos
const sequelize = new Sequelize(
  process.env.DB_NAME || 'defaultdb',
  process.env.DB_USER || 'avnadmin',
  process.env.DB_PASSWORD || process.env.DB_PASS, // Aceita as duas variações de nome
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 13908,
    dialect: 'mysql',
    logging: false,
    
    // Configurações cruciais para Aiven e Render
    dialectOptions: {
      connectTimeout: 60000, // 60 segundos para evitar ETIMEDOUT
      ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
      } : false // Só usa SSL se estiver em produção
    },
    
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000
    }
  }
);

// Testa a conexão ao iniciar
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');
  } catch (error) {
    console.error('❌ Erro ao conectar com o banco de dados:', error.message);
  }
})();

module.exports = sequelize;