import { useState } from 'react';
import { Search, Send, MessageCircle } from 'lucide-react';
import { Sidebar } from '../../Components/Sidebar';
import { useAuth } from '../../store/auth';
import './MessagesPage.css';

const entrepreneurConversations = [
  {
    id: 1,
    name: 'Michael Rodriguez',
    initial: 'M',
    role: 'Investor',
    lastMessage: 'I am interested in your startup pitch!',
    time: '5 min ago',
    unread: 2,
  },
  {
    id: 2,
    name: 'Jennifer Lee',
    initial: 'J',
    role: 'Investor',
    lastMessage: 'Can you share your financial projections?',
    time: '2 hrs ago',
    unread: 0,
  },
  {
    id: 3,
    name: 'David Chen',
    initial: 'D',
    role: 'Investor',
    lastMessage: 'Lets schedule a call this week.',
    time: '1 day ago',
    unread: 1,
  },
];

const investorConversations = [
  {
    id: 1,
    name: 'TechWave AI',
    initial: 'T',
    role: 'Startup',
    lastMessage: 'Thank you for your interest in our startup!',
    time: '10 min ago',
    unread: 3,
  },
  {
    id: 2,
    name: 'GreenLife Solutions',
    initial: 'G',
    role: 'Startup',
    lastMessage: 'We have updated our pitch deck.',
    time: '1 hr ago',
    unread: 0,
  },
  {
    id: 3,
    name: 'HealthPulse',
    initial: 'H',
    role: 'Startup',
    lastMessage: 'Looking forward to our meeting!',
    time: '3 days ago',
    unread: 0,
  },
];

const sampleMessages = {
  1: [
    { id: 1, sender: 'them', text: 'Hi! I saw your startup profile.', time: '10:00 AM' },
    { id: 2, sender: 'me', text: 'Thank you! Happy to connect.', time: '10:02 AM' },
    { id: 3, sender: 'them', text: 'I am interested in your startup pitch!', time: '10:05 AM' },
  ],
  2: [
    { id: 1, sender: 'them', text: 'Hello! Can you share your financial projections?', time: '9:00 AM' },
    { id: 2, sender: 'me', text: 'Sure! I will send them right away.', time: '9:05 AM' },
  ],
  3: [
    { id: 1, sender: 'them', text: 'Lets schedule a call this week.', time: 'Yesterday' },
    { id: 2, sender: 'me', text: 'Sounds great! Tuesday works for me.', time: 'Yesterday' },
  ],
};

const MessagesPage = () => {
  const { user } = useAuth();
  const role = user?.role || 'entrepreneur';

  const conversations = role === 'investor' ? investorConversations : entrepreneurConversations;

  const [selectedChat, setSelectedChat] = useState(conversations[0]);
  const [messages, setMessages] = useState(sampleMessages[conversations[0].id]);
  const [newMessage, setNewMessage] = useState('');
  const [search, setSearch] = useState('');

  const handleSelectChat = (conv) => {
    setSelectedChat(conv);
    setMessages(sampleMessages[conv.id] || []);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        sender: 'me',
        text: newMessage,
        time: 'Just now',
      },
    ]);
    setNewMessage('');
  };

  const filteredConversations = conversations.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="messages-wrapper">
      <Sidebar role={role} />

      <div className="messages-container">

        {/* Left - Conversation List */}
        <div className="conv-list">
          <div className="conv-header">
            <h2>Messages</h2>
          </div>

          <div className="conv-search">
            <Search size={16} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="conv-items">
            {filteredConversations.map(conv => (
              <div
                key={conv.id}
                className={`conv-item ${selectedChat?.id === conv.id ? 'active' : ''}`}
                onClick={() => handleSelectChat(conv)}
              >
                <div className="conv-avatar">{conv.initial}</div>
                <div className="conv-info">
                  <div className="conv-top">
                    <span className="conv-name">{conv.name}</span>
                    <span className="conv-time">{conv.time}</span>
                  </div>
                  <div className="conv-bottom">
                    <span className="conv-last">{conv.lastMessage}</span>
                    {conv.unread > 0 && (
                      <span className="conv-unread">{conv.unread}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Chat Area */}
        {selectedChat ? (
          <div className="chat-area">

            <div className="chat-header">
              <div className="conv-avatar">{selectedChat.initial}</div>
              <div>
                <p className="chat-name">{selectedChat.name}</p>
                <p className="chat-role">{selectedChat.role}</p>
              </div>
            </div>

            <div className="chat-messages">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`msg-bubble-wrap ${msg.sender === 'me' ? 'me' : 'them'}`}
                >
                  <div className={`msg-bubble ${msg.sender === 'me' ? 'bubble-me' : 'bubble-them'}`}>
                    <p>{msg.text}</p>
                    <span className="msg-time">{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <form className="chat-input-row" onSubmit={handleSend}>
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit" className="send-btn">
                <Send size={18} />
              </button>
            </form>
          </div>
        ) : (
          <div className="chat-empty">
            <MessageCircle size={40} color="#94a3b8" />
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;