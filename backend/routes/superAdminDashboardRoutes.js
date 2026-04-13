// backend/routes/superAdminDashboardRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const controller = require("../controllers/superAdminDashboardController");

// ================================
// ROTAS SUPER ADMIN DASHBOARD
// Prefixo real: /api/super
// ================================

router.get("/uso", authMiddleware, controller.usoSistema);
router.get("/downloads", authMiddleware, controller.downloads);
router.get("/usuarios-ativos", authMiddleware, controller.usuariosAtivos);
router.get("/receita-servico", authMiddleware, controller.receitaPorServico);
router.get("/receita-total-mensal", authMiddleware, controller.receitaTotalMensal);

module.exports = router;
