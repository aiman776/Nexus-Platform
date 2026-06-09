import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, Briefcase, Users, MessageCircle,
  Bell, FileText, Settings, HelpCircle,
  DollarSign, HandshakeIcon, Calendar
} from "lucide-react";
import { useAuth } from "../store/auth";
import "./Sidebar.css";

const settingsLinks = [
  { to: "/settings", icon: <Settings size={20} />, label: "Settings" },
  { to: "/help",     icon: <HelpCircle size={20} />, label: "Help & Support" },
];

export const Sidebar = () => {
  const { user, token } = useAuth();

  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      if (!token) return;
      try {
        // ✅ Messages unread count
        const msgRes = await fetch('http://localhost:1000/api/messages/conversations', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const msgData = await msgRes.json();
        if (msgRes.ok) {
          const total = (msgData.conversations || []).reduce(
            (sum, c) => sum + (c.unreadCount || 0), 0
          );
          setUnreadMessages(total);
        }
      } catch (err) {
        console.error(err);
      }
    };

    const fetchUnreadNotifications = async () => {
      if (!token || !user) return;
      try {
        // ✅ Notifications unread count - role ke mutabiq
        const url = user.role === 'investor'
          ? 'http://localhost:1000/api/collaborations/sent'
          : 'http://localhost:1000/api/collaborations/received';

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          const unread = (data.requests || []).filter(
            r => r.isRead === false || r.status === 'pending'
          ).length;
          setUnreadNotifications(unread);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUnread();
    fetchUnreadNotifications();

    // ✅ Har 30 second mein refresh
    const interval = setInterval(() => {
      fetchUnread();
      fetchUnreadNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, [token, user]);

  if (!user) return <aside className="sidebar"></aside>;

  const role = user.role;
  const userId = user._id || user.id;

  const entrepreneurLinks = [
    { to: "/dashboard/entrepreneur", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { to: `/entrepreneur/${userId}`,  icon: <Briefcase size={20} />,       label: "My Startup" },
    { to: "/find-investors",          icon: <Users size={20} />,            label: "Find Investors" },
    { to: "/messages",                icon: <MessageCircle size={20} />,    label: "Messages",      badge: unreadMessages },
    { to: "/notifications",           icon: <Bell size={20} />,             label: "Notifications", badge: unreadNotifications },
    { to: "/meetings",                icon: <Calendar size={20} />,         label: "Meetings" },
    { to: "/documents",               icon: <FileText size={20} />,         label: "Documents" },
  ];

  const investorLinks = [
    { to: "/dashboard/investor", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { to: `/investor/mine`,      icon: <DollarSign size={20} />,      label: "My Portfolio" },
    { to: "/find-startups",      icon: <Users size={20} />,           label: "Find Startups" },
    { to: "/messages",           icon: <MessageCircle size={20} />,   label: "Messages",      badge: unreadMessages },
    { to: "/notifications",      icon: <Bell size={20} />,            label: "Notifications", badge: unreadNotifications },
    { to: "/meetings",           icon: <Calendar size={20} />,        label: "Meetings" },
    { to: "/deals",              icon: <HandshakeIcon size={20} />,   label: "Deals" },
  ];

  const links = role === "investor" ? investorLinks : entrepreneurLinks;

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul>
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  isActive ? "sidebar-link active" : "sidebar-link"
                }
              >
                {link.icon}
                <span>{link.label}</span>
                {link.badge > 0 && (
                  <span className="sidebar-badge">{link.badge}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="sidebar-settings-title">SETTINGS</div>
        <ul>
          {settingsLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  isActive ? "sidebar-link active" : "sidebar-link"
                }
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="sidebar-support">
          <p>Need assistance?</p>
          <a href="mailto:support@pitchnest.com">Contact Support</a>
          <span>support@pitchnest.com</span>
        </div>
      </nav>
    </aside>
  );
};