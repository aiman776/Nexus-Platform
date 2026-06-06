const express = require('express');
const router = express.Router();
const { getConversations, createConversation, getMessages, sendMessage } = require('../controllers/message_controller');
const { authMiddleware } = require('../middlewares/auth-middleware');

router.get('/conversations', authMiddleware, getConversations);
router.post('/conversations', authMiddleware, createConversation);
router.get('/conversations/:conversationId', authMiddleware, getMessages);
router.post('/send', authMiddleware, sendMessage);

module.exports = router;