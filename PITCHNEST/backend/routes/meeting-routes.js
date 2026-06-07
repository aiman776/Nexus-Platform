const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth-middleware');
const {
  scheduleMeeting,
  getMyMeetings,
  acceptMeeting,
  rejectMeeting,
  cancelMeeting,
} = require('../controllers/meeting_controller');

router.post('/schedule', authMiddleware, scheduleMeeting);
router.get('/my-meetings', authMiddleware, getMyMeetings);
router.put('/accept/:id', authMiddleware, acceptMeeting);
router.put('/reject/:id', authMiddleware, rejectMeeting);
router.put('/cancel/:id', authMiddleware, cancelMeeting);

module.exports = router;