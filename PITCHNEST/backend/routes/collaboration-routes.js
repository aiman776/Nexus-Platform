const express = require('express');
const router = express.Router();
const {
  sendRequest,
  getReceivedRequests,
  getSentRequests,
  updateRequestStatus,
  markAsRead,
  markAllAsRead,
} = require('../controllers/collaboration_controller');
const { authMiddleware } = require('../middlewares/auth-middleware');

router.post('/', authMiddleware, sendRequest);
router.get('/received', authMiddleware, getReceivedRequests);
router.get('/sent', authMiddleware, getSentRequests);

// ✅ IMPORTANT: /read-all pehle rakho /:id se pehle
// warna /read-all bhi /:id samajh lega
router.put('/read-all', authMiddleware, markAllAsRead);
router.put('/:id/read', authMiddleware, markAsRead);
router.put('/:id', authMiddleware, updateRequestStatus);

module.exports = router;