const express = require('express');
const router = express.Router();
const {
  getAllInvestors,
  getInvestorById,
  getInvestorByUserId,
  getMyInvestorProfile,
  createInvestorProfile,
  updateInvestorProfile,
} = require('../controllers/investor_controller');
const { authMiddleware } = require('../middlewares/auth-middleware');

router.get('/', authMiddleware, getAllInvestors);

// ✅ /mine aur /user/:userId PEHLE rakho /:id se pehle
router.get('/mine', authMiddleware, getMyInvestorProfile);
router.get('/user/:userId', authMiddleware, getInvestorByUserId);

router.get('/:id', authMiddleware, getInvestorById);
router.post('/', authMiddleware, createInvestorProfile);
router.put('/', authMiddleware, updateInvestorProfile);
// ✅ Saare investor role users fetch karo
router.get('/all-users', authMiddleware, async (req, res) => {
  try {
    const User = require('../models/user');
    const investors = await User.find({ role: 'investor' }).select('-password');
    res.status(200).json({ success: true, investors });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;