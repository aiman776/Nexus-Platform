import { useState, useEffect, useRef } from 'react';
import { Search, Send, MessageCircle, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Sidebar } from '../../Components/Sidebar';
import { useAuth } from '../../store/auth';
import './MessagesPage.css';

const socket = io('http://localhost:1000');

const MessagesPage = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [incomingCall, setIncomingCall] = useState(null); // ✅ Incoming call state
  const messagesEndRef = useRef(null);

  // ✅ Socket register + incoming call listen
  useEffect(() => {
    if (!user?._id) return;

    // ✅ Apna userId register karo
    socket.emit('register-user', user._id);

    // ✅ Incoming call aaye to popup dikhao
    socket.on('incoming-call', ({ callerId, callerName, roomId }) => {
      setIncomingCall({ callerId, callerName, roomId });
    });

    // ✅ Call decline hua
    socket.on('call-declined', () => {
      alert('Call declined by the other person.');
    });

    // ✅ User offline hai
    socket.on('user-offline', () => {
      alert('User is currently offline. They cannot receive calls.');
    });

    return () => {
      socket.off('incoming-call');
      socket.off('call-declined');
      socket.off('user-offline');
    };
  }, [user]);

  // ✅ Conversations fetch
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch('http://localhost:1000/api/messages/conversations', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setConversations(data.conversations || []);
          if (data.conversations?.length > 0 && !selectedChat) {
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

  // ✅ Messages fetch + mark as read
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) return;
      try {
        const res = await fetch(
          `http://localhost:1000/api/messages/conversations/${selectedChat._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (res.ok) {
          setMessages(data.messages || []);
          setConversations(prev =>
            prev.map(c => c._id === selectedChat._id
              ? { ...c, unreadCount: 0 }
              : c
            )
          );
          await fetch(
            `http://localhost:1000/api/messages/conversations/${selectedChat._id}/read`,
            { method: 'PUT', headers: { Authorization: `Bearer ${token}` } }
          );
        }
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

  // ✅ Video Call shuru karo - dusre ko notification bhejo
  const handleVideoCall = () => {
    if (!selectedChat) return;
    const receiver = getOtherMember(selectedChat);
    if (!receiver) return;

    // ✅ Dusre ko socket notification bhejo
    socket.emit('call-user', {
      receiverId: receiver._id,
      callerId: user._id,
      callerName: user.username,
      roomId: selectedChat._id,
    });

    // ✅ Khud video call page pe jao
    navigate(`/video-call/${selectedChat._id}`);
  };

  // ✅ Incoming call Accept
  const handleAcceptCall = () => {
    if (!incomingCall) return;
    socket.emit('accept-call', {
      callerId: incomingCall.callerId,
      roomId: incomingCall.roomId,
    });
    setIncomingCall(null);
    navigate(`/video-call/${incomingCall.roomId}`);
  };

  // ✅ Incoming call Decline
  const handleDeclineCall = () => {
    if (!incomingCall) return;
    socket.emit('decline-call', { callerId: incomingCall.callerId });
    setIncomingCall(null);
  };

  const getOtherMember = (conversation) => {
    return conversation.members?.find(m => m._id !== user?._id);
  };

  const totalUnread = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  const filteredConversations = conversations.filter(c => {
    const other = getOtherMember(c);
    return other?.username?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="messages-wrapper">
      <Sidebar />

      {/* ✅ Incoming Call Popup */}
      {incomingCall && (
        <div className="incoming-call-popup">
          <div className="incoming-call-card">
            <div className="incoming-call-avatar">
              {incomingCall.callerName?.charAt(0).toUpperCase()}
            </div>
            <div className="incoming-call-info">
              <h3>{incomingCall.callerName}</h3>
              <p>Incoming Video Call...</p>
            </div>
            <div className="incoming-call-actions">
              <button className="accept-btn" onClick={handleAcceptCall}>
                Accept
              </button>
              <button className="decline-btn" onClick={handleDeclineCall}>
                Decline
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="messages-container">

        {/* Left - Conversation List */}
        <div className="conv-list">
          <div className="conv-header">
            <h2>
              Messages
              {totalUnread > 0 && (
                <span className="conv-header-badge">{totalUnread}</span>
              )}
            </h2>
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

              {/* ✅ Video call button */}
              <button className="video-call-btn" onClick={handleVideoCall}>
                <Video size={18} /> Video Call
              </button>
            </div>

            <div className="chat-messages">
              {messages.map(msg => (
                <div
                  key={msg._id}
                  className={`msg-bubble-wrap ${
                    msg.sender?._id === user?._id || msg.sender === user?._id
                      ? 'me' : 'them'
                  }`}
                >
                  <div className={`msg-bubble ${
                    msg.sender?._id === user?._id || msg.sender === user?._id
                      ? 'bubble-me' : 'bubble-them'
                  }`}>
                    <p>{msg.text}</p>
                    <span className="msg-time">
                      {msg.createdAt
                        ? new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: '2-digit', minute: '2-digit'
                          })
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
