const express = require('express');
const router = express.Router();
const { sendRequest, getReceivedRequests, getSentRequests, updateRequestStatus } = require('../controllers/collaboration_controller');
const { authMiddleware } = require('../middlewares/auth-middleware');

router.post('/', authMiddleware, sendRequest);
router.get('/received', authMiddleware, getReceivedRequests);
router.get('/sent', authMiddleware, getSentRequests);
router.put('/:id', authMiddleware, updateRequestStatus);

module.exports = router;