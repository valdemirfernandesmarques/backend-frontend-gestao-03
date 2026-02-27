// backend/routes/pagamentoRoutes.js
const express = require('express');
const router = express.Router();

const pagamentoController = require('../controllers/pagamentoController');
const authMiddleware = require('../middleware/authMiddleware');

// 🔐 Middleware de autenticação
router.use(authMiddleware);

// ✅ REGISTRAR PAGAMENTO
router.post('/', pagamentoController.registrarPagamento);

// ✅ LISTAR PAGAMENTOS
router.get('/', pagamentoController.listarPagamentos);

module.exports = router;
