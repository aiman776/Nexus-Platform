const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  lastMessage: { type: String, default: '' },

  // ✅ Per-user unread count - har user ka alag
  unreadCounts: {
    type: Map,
    of: Number,
    default: {},
  },

}, { timestamps: true });

const Conversation = mongoose.model('Conversation', ConversationSchema);
module.exports = Conversation;