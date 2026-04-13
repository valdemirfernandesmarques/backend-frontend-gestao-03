// backend/routes/onboardingRoutes.js

const express = require('express');
const router = express.Router();

const onboardingController = require('../controllers/onboardingController');

// 🔓 Endpoint público (ativação inicial)
router.post('/activate', onboardingController.activate);

module.exports = router;
