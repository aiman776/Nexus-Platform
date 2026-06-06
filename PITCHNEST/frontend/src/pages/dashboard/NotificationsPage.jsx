import { useState, useEffect } from 'react';
import { Bell, MessageCircle, UserPlus, DollarSign } from 'lucide-react';
import { Sidebar } from '../../Components/Sidebar';
import { useAuth } from '../../store/auth';
import './NotificationsPage.css';

const getNotificationIcon = (type) => {
  switch (type) {
    case 'message': return <MessageCircle size={16} className="icon-blue" />;
    case 'connection': return <UserPlus size={16} className="icon-purple" />;
    case 'investment': return <DollarSign size={16} className="icon-orange" />;
    default: return <Bell size={16} className="icon-gray" />;
  }
};

const NotificationsPage = () => {
  const { user, token } = useAuth();
  const role = user?.role || 'entrepreneur';

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Backend se collaboration requests ko notifications ki tarah show karo
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Entrepreneur ke liye received requests
        // Investor ke liye sent requests
        const url = role === 'investor'
          ? 'http://localhost:1000/api/collaborations/sent'
          : 'http://localhost:1000/api/collaborations/received';

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok) {
          // ✅ Requests ko notification format mein convert karo
          const notifs = (data.requests || []).map(req => ({
            id: req._id,
            type: 'investment',
            user: {
              name: role === 'investor'
                ? req.receiver?.username
                : req.sender?.username,
              initial: role === 'investor'
                ? req.receiver?.username?.charAt(0).toUpperCase()
                : req.sender?.username?.charAt(0).toUpperCase(),
            },
            content: role === 'investor'
              ? `You sent a collaboration request — Status: ${req.status}`
              : `sent you a collaboration request`,
            time: new Date(req.createdAt).toLocaleDateString(),
            unread: req.status === 'pending',
            status: req.status,
          }));
          setNotifications(notifs);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchNotifications();
  }, [token, role]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const markRead = (id) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, unread: false } : n
    ));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="dashboard-layout">
      <Sidebar role={role} />
      <main className="dashboard-main">

        <div className="dashboard-header">
          <div>
            <h1>Notifications</h1>
            <p>Stay updated with your network activity</p>
          </div>
          {unreadCount > 0 && (
            <button className="dashboard-btn" onClick={markAllRead}>
              Mark all as read ({unreadCount})
            </button>
          )}
        </div>

        <div className="notif-list">
          {loading ? (
            <p>Loading...</p>
          ) : notifications.length === 0 ? (
            <div className="empty-state">
              <Bell size={40} color="#94a3b8" />
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.map(notification => (
              <div
                key={notification.id}
                className={`notif-card ${notification.unread ? 'unread' : ''}`}
                onClick={() => markRead(notification.id)}
              >
                <div className="notif-avatar">
                  {notification.user?.initial}
                </div>
                <div className="notif-content">
                  <div className="notif-top">
                    <span className="notif-name">{notification.user?.name}</span>
                    {notification.unread && (
                      <span className="notif-badge">New</span>
                    )}
                  </div>
                  <p className="notif-text">{notification.content}</p>
                  <div className="notif-meta">
                    {getNotificationIcon(notification.type)}
                    <span>{notification.time}</span>
                  </div>
                </div>
                {notification.unread && <div className="notif-dot" />}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default NotificationsPage;