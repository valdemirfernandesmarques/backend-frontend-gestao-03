// backend/routes/funcionarioRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/funcionarioController');
const authMiddleware = require('../middleware/authMiddleware');

// Testa se o controller foi carregado
console.log('Controller Funcionario:', controller);

// Criar um novo funcionário
router.post('/', authMiddleware, controller.criarFuncionario);

// Listar todos os funcionários
router.get('/', authMiddleware, controller.listarFuncionarios);

// Obter um funcionário por ID
router.get('/:id', authMiddleware, controller.obterFuncionario);

// Atualizar um funcionário por ID
router.put('/:id', authMiddleware, controller.atualizarFuncionario);

// Deletar um funcionário por ID
router.delete('/:id', authMiddleware, controller.deletarFuncionario);

module.exports = router;
