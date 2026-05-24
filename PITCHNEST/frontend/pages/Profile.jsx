import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import "./Profile.css";

const Profile = () => {
  const { LogoutUser, token } = useAuth(); // ✅ Corrected function name
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // ✅ Fetch user profile from backend using valid JWT token
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:7000/api/auth/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        if (res.ok) {
          setUser(data);
        } else {
          console.error("Profile fetch failed:", data);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  // ✅ Logout handler
  const handleLogout = () => {
    LogoutUser(); // ✅ Clears token + localStorage
    navigate("/login"); // ✅ Redirect to login page
  };

  // ✅ Go Back handler
  const handleGoBack = () => {
    navigate("/"); // ✅ Or navigate(-1) to go back in history
  };

  // ✅ Loading state
  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <h2>👤 My Profile</h2>
          <p>Loading your details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>👤 My Profile</h2>

        <div className="profile-details">
          <p>
            <strong>Name:</strong> {user.username || user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Phone:</strong> {user.phone || "N/A"}
          </p>
          <p>
            <strong>Age:</strong> {user.age || "N/A"}
          </p>
        </div>

        <div className="profile-buttons">
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
          <button className="go-back-btn" onClick={handleGoBack}>
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
