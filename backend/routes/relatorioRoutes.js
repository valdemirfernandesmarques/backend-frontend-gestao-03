// backend/routes/relatorioRoutes.js
const express = require('express');
const router = express.Router();

const relatorioController = require('../controllers/relatorioController');
const authMiddleware = require('../middleware/authMiddleware');

// ======================================
// ROTAS DE RELATÓRIO (PROTEGIDAS)
// ======================================

// Relatório financeiro (mensalidades + vendas)
// ADMIN_ESCOLA → apenas sua própria escola
// SUPER_ADMIN → bloqueado no controller
router.get(
  '/',
  authMiddleware,
  relatorioController.getRelatorioFinanceiro
);

// Relatório somente de mensalidades
router.get(
  '/mensalidades',
  authMiddleware,
  relatorioController.relatorioMensalidades
);

// Rota de teste (protegida também)
router.get(
  '/teste',
  authMiddleware,
  relatorioController.testeRelatorio
);

module.exports = router;
