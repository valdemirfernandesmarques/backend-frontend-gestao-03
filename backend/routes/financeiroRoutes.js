const express = require('express');
const router = express.Router();

const financeiroController = require('../controllers/financeiroController');
const authMiddleware = require('../middleware/authMiddleware');

// ===============================
// ROTAS FINANCEIRO
// ===============================

// Listar lançamentos
router.get('/', authMiddleware, financeiroController.listarLancamentos);

// Resumo financeiro
router.get('/resumo', authMiddleware, financeiroController.resumoFinanceiro);

// Dashboard financeiro
router.get('/dashboard', authMiddleware, financeiroController.dashboardFinanceiro);

// Fluxo financeiro (corrigido)
router.get('/fluxo', authMiddleware, financeiroController.fluxoFinanceiro);

module.exports = router;
