import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Briefcase, Users, MessageCircle,
  Bell, FileText, Settings, HelpCircle,
  DollarSign, HandshakeIcon
} from "lucide-react";
import { useAuth } from "../store/auth"; // ✅ add karo
import "./Sidebar.css";

const settingsLinks = [
  { to: "/settings", icon: <Settings size={20} />, label: "Settings" },
  { to: "/help", icon: <HelpCircle size={20} />, label: "Help & Support" },
];

export const Sidebar = ({ role }) => {
  const { user } = useAuth(); // ✅ user lo
  const userId = user?._id || "1"; // ✅ real id ya fallback

  // ✅ Role based links with real user id
  const entrepreneurLinks = [
    { to: "/dashboard/entrepreneur", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { to: `/entrepreneur/${userId}`, icon: <Briefcase size={20} />, label: "My Startup" },
    { to: "/find-investors", icon: <Users size={20} />, label: "Find Investors" },
    { to: "/messages", icon: <MessageCircle size={20} />, label: "Messages" },
    { to: "/notifications", icon: <Bell size={20} />, label: "Notifications" },
    { to: "/documents", icon: <FileText size={20} />, label: "Documents" },
  ];
const investorLinks = [
  { to: "/dashboard/investor", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
  { to: `/investor/${userId}`, icon: <DollarSign size={20} />, label: "My Portfolio" }, // ✅ investor hona chahiye
  { to: "/find-startups", icon: <Users size={20} />, label: "Find Startups" },
  { to: "/messages", icon: <MessageCircle size={20} />, label: "Messages" },
  { to: "/notifications", icon: <Bell size={20} />, label: "Notifications" },
  { to: "/deals", icon: <HandshakeIcon size={20} />, label: "Deals" },
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