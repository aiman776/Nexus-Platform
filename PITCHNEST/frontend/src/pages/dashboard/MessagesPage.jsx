import { useState, useEffect, useRef } from 'react';
import { Search, Send, MessageCircle } from 'lucide-react';
import { Sidebar } from '../../Components/Sidebar';
import { useAuth } from '../../store/auth';
import './MessagesPage.css';

const MessagesPage = () => {
  const { user, token } = useAuth();
  const role = user?.role || 'entrepreneur';

  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // ✅ Conversations fetch karo
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch('http://localhost:1000/api/messages/conversations', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setConversations(data.conversations || []);
          if (data.conversations?.length > 0) {
            setSelectedChat(data.conversations[0]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchConversations();
  }, [token]);

  // ✅ Messages fetch karo jab conversation select ho
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) return;
      try {
        const res = await fetch(
          `http://localhost:1000/api/messages/conversations/${selectedChat._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (res.ok) setMessages(data.messages || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();
  }, [selectedChat, token]);

  // ✅ Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ✅ Message bhejo
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;
    try {
      const res = await fetch('http://localhost:1000/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          conversationId: selectedChat._id,
          text: newMessage,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages(prev => [...prev, data.message]);
        setNewMessage('');
        // ✅ Last message update karo
        setConversations(prev =>
          prev.map(c => c._id === selectedChat._id
            ? { ...c, lastMessage: newMessage }
            : c
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Doosre member ka naam nikalo
  const getOtherMember = (conversation) => {
    return conversation.members?.find(m => m._id !== user?._id);
  };

  const filteredConversations = conversations.filter(c => {
    const other = getOtherMember(c);
    return other?.username?.toLowerCase().includes(search.toLowerCase());
  });

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
            {loading ? (
              <p style={{ padding: '16px' }}>Loading...</p>
            ) : filteredConversations.length === 0 ? (
              <p style={{ padding: '16px', color: '#94a3b8' }}>No conversations yet</p>
            ) : (
              filteredConversations.map(conv => {
                const other = getOtherMember(conv);
                return (
                  <div
                    key={conv._id}
                    className={`conv-item ${selectedChat?._id === conv._id ? 'active' : ''}`}
                    onClick={() => setSelectedChat(conv)}
                  >
                    <div className="conv-avatar">
                      {other?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="conv-info">
                      <div className="conv-top">
                        <span className="conv-name">{other?.username}</span>
                        <span className="conv-time">
                          {conv.updatedAt
                            ? new Date(conv.updatedAt).toLocaleDateString()
                            : ''}
                        </span>
                      </div>
                      <div className="conv-bottom">
                        <span className="conv-last">
                          {conv.lastMessage || 'No messages yet'}
                        </span>
                        {conv.unreadCount > 0 && (
                          <span className="conv-unread">{conv.unreadCount}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right - Chat Area */}
        {selectedChat ? (
          <div className="chat-area">
            <div className="chat-header">
              <div className="conv-avatar">
                {getOtherMember(selectedChat)?.username?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="chat-name">{getOtherMember(selectedChat)?.username}</p>
                <p className="chat-role">{getOtherMember(selectedChat)?.role}</p>
              </div>
            </div>

            <div className="chat-messages">
              {messages.map(msg => (
                <div
                  key={msg._id}
                  className={`msg-bubble-wrap ${msg.sender?._id === user?._id || msg.sender === user?._id ? 'me' : 'them'}`}
                >
                  <div className={`msg-bubble ${msg.sender?._id === user?._id || msg.sender === user?._id ? 'bubble-me' : 'bubble-them'}`}>
                    <p>{msg.text}</p>
                    <span className="msg-time">
                      {msg.createdAt
                        ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : 'Just now'}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
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