const express = require('express');
const router = express.Router();
const { getAllInvestors, getInvestorById, getMyInvestorProfile, createInvestorProfile, updateInvestorProfile } = require('../controllers/investor_controller');
const { authMiddleware } = require('../middlewares/auth-middleware');

router.get('/', authMiddleware, getAllInvestors);
router.get('/mine', authMiddleware, getMyInvestorProfile);
router.get('/:id', authMiddleware, getInvestorById);
router.post('/', authMiddleware, createInvestorProfile);
router.put('/', authMiddleware, updateInvestorProfile);

module.exports = router;