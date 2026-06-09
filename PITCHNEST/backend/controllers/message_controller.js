const Conversation = require('../models/conversation-model');
const Message = require('../models/message-model');

// ✅ Conversations fetch karo - with per-user unread count
const getConversations = async (req, res) => {
  try {
    const myId = req.user._id.toString();

    const conversations = await Conversation.find({
      members: { $in: [req.user._id] }
    }).populate('members', 'username email role');

    // ✅ Har conversation mein apna unread count add karo
    const result = conversations.map(conv => {
      const convObj = conv.toObject();
      const unreadCount = conv.unreadCounts?.get(myId) || 0;
      return { ...convObj, unreadCount };
    });

    res.status(200).json({ success: true, conversations: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Conversation create karo ya existing dhundho
const createConversation = async (req, res) => {
  try {
    const { receiverId } = req.body;

    const existing = await Conversation.findOne({
      members: { $all: [req.user._id, receiverId] }
    }).populate('members', 'username email role');

    if (existing) {
      return res.status(200).json({ success: true, conversation: existing });
    }

    const conversation = new Conversation({
      members: [req.user._id, receiverId],
      unreadCounts: {},
    });

    await conversation.save();
    await conversation.populate('members', 'username email role');

    res.status(201).json({ success: true, conversation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Messages fetch karo
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId
    }).populate('sender', 'username email');

    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Message bhejo - sirf receiver ka unread badhao
const sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;
    const senderId = req.user._id.toString();

    const message = new Message({
      conversationId,
      sender: req.user._id,
      text,
    });

    await message.save();
    await message.populate('sender', 'username email');

    // ✅ Receiver ka unread count badhao
    const conversation = await Conversation.findById(conversationId);

    const receiverId = conversation.members
      .map(m => m.toString())
      .find(m => m !== senderId);

    if (receiverId) {
      const currentCount = conversation.unreadCounts?.get(receiverId) || 0;
      conversation.unreadCounts.set(receiverId, currentCount + 1);
    }

    conversation.lastMessage = text;
    await conversation.save();

    res.status(201).json({ success: true, message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Mark as read - apna unread 0 karo
const markAsRead = async (req, res) => {
  try {
    const myId = req.user._id.toString();
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    conversation.unreadCounts.set(myId, 0);
    await conversation.save();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getConversations,
  createConversation,
  getMessages,
  sendMessage,
  markAsRead,
};