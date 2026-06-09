import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../store/auth";
import { useState } from "react";
import {
  LayoutDashboard, MessageCircle, Bell, User, LogOut, Home,
} from "lucide-react";

export const Navbar = () => {
  const { isLoggedIn, user, LogoutUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const firstLetter = user?.username?.charAt(0).toUpperCase() || "U";
  const username = user?.username || "";

  const dashboardLink = user?.role === "investor"
    ? "/dashboard/investor"
    : "/dashboard/entrepreneur";

  // ✅ Role based profile link
  const profileLink = user?.role === "investor"
    ? `/investor/${user?._id || user?.id}`
    : `/entrepreneur/${user?._id || user?.id}`;

  // ✅ Logout handler
  const handleLogout = (e) => {
    e.preventDefault();
    LogoutUser();
    navigate("/login");
  };

  // ✅ Avatar click - profile pe jao
  const handleAvatarClick = () => {
    if (user) navigate(profileLink);
  };

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
                  <a href="#" onClick={handleLogout}>
                    <LogOut size={17} /> Logout
                  </a>
                </li>

                {/* ✅ Avatar - click pe profile, green dot online status */}
                <li
                  className="avatar-wrapper"
                  onClick={handleAvatarClick}
                  style={{ cursor: "pointer" }}
                  title={`View ${username}'s profile`}
                >
                  <div className="avatar-circle-wrapper">
                    <div className="avatar-circle">{firstLetter}</div>
                    {/* ✅ Green dot - online */}
                    <span className="avatar-online-dot"></span>
                  </div>
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