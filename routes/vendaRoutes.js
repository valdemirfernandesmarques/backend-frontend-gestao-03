const express = require('express');
const router = express.Router();

const vendaController = require('../controllers/vendaController');
const authMiddleware = require('../middleware/authMiddleware'); // ✅ SINGULAR

router.post('/', authMiddleware, vendaController.criarVenda);
router.get('/', authMiddleware, vendaController.listarVendas);

module.exports = router;

