import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../store/auth";
import { useState } from "react";
import {
  LayoutDashboard, MessageCircle, Bell, User, LogOut, Home,
} from "lucide-react";

export const Navbar = () => {
  const { isLoggedIn, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const firstLetter = user?.username?.charAt(0).toUpperCase() || "U";
  const username = user?.username || "";

  // ✅ Role ke mutabik dashboard link
  const dashboardLink = user?.role === "investor"
    ? "/dashboard/investor"
    : "/dashboard/entrepreneur";

  return (
    <header>
      <div className="top-navbar">

        <div className="logo-brand">
          <NavLink to="/">
            <img src="/pitchnest-logo.png" alt="Logo" />
            <span>PITCHNEST</span>
          </NavLink>
        </div>

        <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✕" : "☰"}
        </div>

        <nav className={`top-nav ${menuOpen ? "open" : ""}`}>
          <ul onClick={() => setMenuOpen(false)}>
            {isLoggedIn ? (
              <>
                {/* ✅ Role based dashboard link */}
                <li>
                  <NavLink to={dashboardLink}>
                    <LayoutDashboard size={17} /> Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/messages">
                    <MessageCircle size={17} /> Messages
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/notifications">
                    <Bell size={17} /> Notifications
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/profile">
                    <User size={17} /> Profile
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/logout">
                    <LogOut size={17} /> Logout
                  </NavLink>
                </li>
                <li className="avatar-wrapper">
                  <div className="avatar-circle">{firstLetter}</div>
                  <span className="avatar-name">{username}</span>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="/">
                    <Home size={17} /> Home
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/login">
                    <User size={17} /> Login / SignUp
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};