// backend/routes/recuperarSenhaRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

/**
 * ======================================================
 * 🔐 RECUPERAÇÃO DE SENHA (PÚBLICA)
 * ======================================================
 * - NÃO usa authMiddleware
 * - Funciona para ADMIN_ESCOLA e SUPER_ADMIN
 * - Usa PasswordResetToken (tabela dedicada)
 * - Pronto para produção
 */

/**
 * 📩 SOLICITAR RECUPERAÇÃO DE SENHA
 * POST /api/auth/forgot-password
 */
router.post("/forgot-password", authController.forgotPassword);

/**
 * 🔄 RESETAR SENHA COM TOKEN
 * POST /api/auth/reset-password/:token
 */
router.post("/reset-password/:token", authController.resetPassword);

module.exports = router;
