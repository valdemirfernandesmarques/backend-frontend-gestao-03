// backend/routes/mensalidadeRoutes.js
const express = require('express');
const router = express.Router();

const mensalidadeController = require('../controllers/mensalidadeController');
const authMiddleware = require('../middleware/authMiddleware');

// ===============================
// MENSALIDADES
// ===============================

// Cadastrar mensalidade
router.post(
  '/',
  authMiddleware,
  mensalidadeController.cadastrarMensalidade
);

// Listar mensalidades
router.get(
  '/',
  authMiddleware,
  mensalidadeController.listarMensalidades
);

// Obter mensalidade por ID
router.get(
  '/:id',
  authMiddleware,
  mensalidadeController.obterMensalidade
);

// Atualizar mensalidade
router.put(
  '/:id',
  authMiddleware,
  mensalidadeController.atualizarMensalidade
);

// Deletar mensalidade
router.delete(
  '/:id',
  authMiddleware,
  mensalidadeController.deletarMensalidade
);

// ===============================
// PAGAMENTO DE MENSALIDADE (NOVO)
// ===============================
// ⚠️ Rota isolada, só executa se for chamada
router.post(
  '/:id/pagar',
  authMiddleware,
  mensalidadeController.pagarMensalidade
);

module.exports = router;
