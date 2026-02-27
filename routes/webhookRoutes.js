// backend/routes/webhookRoutes.js

const express = require("express");
const router = express.Router();
const WebhookController = require("../controllers/webhookController");

// 🚫 SEM authMiddleware
router.post("/", WebhookController.handle);

module.exports = router;
