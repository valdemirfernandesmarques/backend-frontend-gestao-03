const express = require('express');
const router = express.Router();

const isencaoTaxaController = require('../controllers/isencaoTaxaController');
const authMiddleware = require('../middleware/authMiddleware');

// Criar isenção
router.post(
  '/',
  authMiddleware,
  isencaoTaxaController.criarIsencao
);

// Listar isenções
router.get(
  '/',
  authMiddleware,
  isencaoTaxaController.listarIsencoes
);

// Ativar / desativar
router.put(
  '/:id/status',
  authMiddleware,
  isencaoTaxaController.alterarStatus
);

module.exports = router;
