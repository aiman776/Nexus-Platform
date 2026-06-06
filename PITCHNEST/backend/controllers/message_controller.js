const Conversation = require('../models/conversation-model');
const Message = require('../models/message-model');

// ✅ Apni saari conversations fetch karo
const getConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({
            members: { $in: [req.user._id] }
        }).populate('members', 'username email role');

        res.status(200).json({ success: true, conversations });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// ✅ Conversation create karo ya existing dhundho
const createConversation = async (req, res) => {
    try {
        const { receiverId } = req.body;

        // Pehle dekho kya already exist karti hai
        const existing = await Conversation.findOne({
            members: { $all: [req.user._id, receiverId] }
        });

        if (existing) {
            return res.status(200).json({ success: true, conversation: existing });
        }

        const conversation = new Conversation({
            members: [req.user._id, receiverId],
        });

        await conversation.save();
        res.status(201).json({ success: true, conversation });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// ✅ Conversation ke messages fetch karo
const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId
        }).populate('sender', 'username email');

        res.status(200).json({ success: true, messages });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// ✅ Message bhejo
const sendMessage = async (req, res) => {
    try {
        const { conversationId, text } = req.body;

        const message = new Message({
            conversationId,
            sender: req.user._id,
            text,
        });

        await message.save();

        // Last message update karo
        await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: text,
            $inc: { unreadCount: 1 },
        });

        res.status(201).json({ success: true, message });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getConversations, createConversation, getMessages, sendMessage };