const express = require('express');
const router = express.Router();

// ✅ Yeh fix karo
const { authMiddleware } = require('../middlewares/auth-middleware');
const { getMyDeals, addDeal, updateDealStatus, deleteDeal } = require('../controllers/deal_controller');

router.get('/my-deals', authMiddleware, getMyDeals);
router.post('/add', authMiddleware, addDeal);
router.put('/:id', authMiddleware, updateDealStatus);
router.delete('/:id', authMiddleware, deleteDeal);

module.exports = router;