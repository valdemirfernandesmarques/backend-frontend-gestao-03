// backend/routes/alunoRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const alunoController = require("../controllers/alunoController");

/**
 * ======================================================
 * 🔒 TODAS AS ROTAS EXIGEM LOGIN
 * ======================================================
 */
router.use(authMiddleware);

/**
 * ======================================================
 * ➕ CRIAR ALUNO
 * ======================================================
 */
router.post("/", alunoController.criarAluno);

/**
 * ======================================================
 * 📋 LISTAR ALUNOS
 * ======================================================
 */
router.get("/", alunoController.listarAlunos);

/**
 * ======================================================
 * 🔍 BUSCAR ALUNO POR ID
 * ======================================================
 */
router.get("/:id", alunoController.buscarAlunoPorId);

/**
 * ======================================================
 * ✏️ ATUALIZAR ALUNO
 * ======================================================
 */
router.put("/:id", alunoController.atualizarAluno);

/**
 * ======================================================
 * 🗑️ DELETAR ALUNO
 * ======================================================
 */
router.delete("/:id", alunoController.deletarAluno);

module.exports = router;
