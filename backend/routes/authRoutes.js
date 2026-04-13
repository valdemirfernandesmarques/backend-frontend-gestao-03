// backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

/**
 * ================================
 * 🔐 AUTENTICAÇÃO
 * ================================
 */

// Login
router.post("/login", authController.login);

/**
 * ================================
 * 🔐 RECUPERAÇÃO DE SENHA (PÚBLICO)
 * ================================
 */

// Solicitar recuperação
router.post("/forgot-password", authController.forgotPassword);

// Resetar senha com token
router.post("/reset-password/:token", authController.resetPassword);

module.exports = router;
