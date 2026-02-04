// backend/routes/transacoesFinanceirasRoutes.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const TransacaoFinanceiraServiceController = require('../controllers/TransacaoFinanceiraServiceController');
const { Parser } = require('json2csv');

/**
 * ======================================================
 * 🔒 ROTAS DE TRANSAÇÕES FINANCEIRAS (SUPER_ADMIN)
 * ======================================================
 * Estas rotas:
 * - NÃO são usadas pelo ADMIN_ESCOLA
 * - NÃO interferem em Mensalidades, Pagamentos ou Financeiro interno
 * - Servem exclusivamente para o Dashboard Financeiro do SUPER_ADMIN
 */

// ------------------------------------------------------
// 📊 Listar TODAS as transações da plataforma
// GET /api/transacoes-financeiras
// ------------------------------------------------------
router.get(
  '/',
  authMiddleware,
  TransacaoFinanceiraServiceController.listarTodas
);

// ------------------------------------------------------
// 🏫 Listar transações por escola
// GET /api/transacoes-financeiras/escola/:escolaId
// ------------------------------------------------------
router.get(
  '/escola/:escolaId',
  authMiddleware,
  TransacaoFinanceiraServiceController.listarPorEscola
);

// ------------------------------------------------------
// 📈 Resumo financeiro da plataforma (Dashboard real)
// GET /api/transacoes-financeiras/resumo
// ------------------------------------------------------
router.get(
  '/resumo',
  authMiddleware,
  TransacaoFinanceiraServiceController.obterResumoPlataforma
);

// ------------------------------------------------------
// 📁 Exportar CSV de transações
// GET /api/transacoes-financeiras/exportar-csv
// ------------------------------------------------------
router.get(
  '/exportar-csv',
  authMiddleware,
  TransacaoFinanceiraServiceController.exportarCSV
);

// ------------------------------------------------------
// 💸 Estorno de transação
// POST /api/transacoes-financeiras/estorno
// ------------------------------------------------------
router.post(
  '/estorno',
  authMiddleware,
  TransacaoFinanceiraServiceController.realizarEstorno
);

module.exports = router;
