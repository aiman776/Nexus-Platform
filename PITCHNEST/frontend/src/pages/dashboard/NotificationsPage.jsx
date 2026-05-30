import { useState } from 'react';
import { Bell, MessageCircle, UserPlus, DollarSign } from 'lucide-react';
import { Sidebar } from '../../Components/Sidebar';
import { useAuth } from '../../store/auth';
import './NotificationsPage.css';

const entrepreneurNotifications = [
  {
    id: 1,
    type: 'message',
    user: { name: 'Sarah Johnson', initial: 'S' },
    content: 'sent you a message about your startup',
    time: '5 minutes ago',
    unread: true
  },
  {
    id: 2,
    type: 'connection',
    user: { name: 'Michael Rodriguez', initial: 'M' },
    content: 'accepted your connection request',
    time: '2 hours ago',
    unread: true
  },
  {
    id: 3,
    type: 'investment',
    user: { name: 'Jennifer Lee', initial: 'J' },
    content: 'showed interest in investing in your startup',
    time: '1 day ago',
    unread: false
  }
];

const investorNotifications = [
  {
    id: 1,
    type: 'message',
    user: { name: 'TechWave AI', initial: 'T' },
    content: 'sent you a message about their pitch deck',
    time: '10 minutes ago',
    unread: true
  },
  {
    id: 2,
    type: 'connection',
    user: { name: 'GreenLife Solutions', initial: 'G' },
    content: 'accepted your collaboration request',
    time: '3 hours ago',
    unread: true
  },
  {
    id: 3,
    type: 'investment',
    user: { name: 'HealthPulse', initial: 'H' },
    content: 'updated their financial projections',
    time: '2 days ago',
    unread: false
  }
];

const getNotificationIcon = (type) => {
  switch (type) {
    case 'message': return <MessageCircle size={16} className="icon-blue" />;
    case 'connection': return <UserPlus size={16} className="icon-purple" />;
    case 'investment': return <DollarSign size={16} className="icon-orange" />;
    default: return <Bell size={16} className="icon-gray" />;
  }
};

const NotificationsPage = () => {
  const { user } = useAuth();
  const role = user?.role || 'entrepreneur';

  // ✅ Role ke mutabik notifications
  const initialNotifs = role === 'investor' ? investorNotifications : entrepreneurNotifications;
  const [notifications, setNotifications] = useState(initialNotifs);

  // ✅ Mark all as read
  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  // ✅ Mark single as read
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

        {/* Header */}
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

        {/* Notification List */}
        <div className="notif-list">
          {notifications.length === 0 ? (
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
                {/* Avatar */}
                <div className="notif-avatar">
                  {notification.user.initial}
                </div>

                {/* Content */}
                <div className="notif-content">
                  <div className="notif-top">
                    <span className="notif-name">{notification.user.name}</span>
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

                {/* Unread dot */}
                {notification.unread && (
                  <div className="notif-dot" />
                )}
              </div>
            ))
          )}
        </div>

      </main>
    </div>
  );
};

export default NotificationsPage;