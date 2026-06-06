const express = require('express');
const router = express.Router();
const { getAllStartups, getMyStartup, createStartup, updateStartup } = require('../controllers/startup_controller');
const { authMiddleware } = require('../middlewares/auth-middleware');

// GET  /api/startups        → saari startups (investors browse karein)
// GET  /api/startups/mine   → apni startup
// POST /api/startups        → startup create karo
// PUT  /api/startups        → startup update karo

router.get('/', authMiddleware, getAllStartups);
router.get('/mine', authMiddleware, getMyStartup);
router.post('/', authMiddleware, createStartup);
router.put('/', authMiddleware, updateStartup);

module.exports = router;