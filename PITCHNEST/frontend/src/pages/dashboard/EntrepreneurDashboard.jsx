
import { Bell, Users, Calendar, TrendingUp } from "lucide-react";
import { Sidebar } from "../../Components/Sidebar";
import { useAuth } from "../../store/auth";
import "./Dashboard.css";

const EntrepreneurDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-layout">
      <Sidebar role="entrepreneur" />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1>Welcome, {user?.username || "User"}</h1>
            <p>Here's what's happening with your startup today</p>
          </div>
          <button className="dashboard-btn">+ Find Investors</button>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue"><Bell size={22} /></div>
            <div>
              <p className="stat-label">Pending Requests</p>
              <h2 className="stat-value">0</h2>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon teal"><Users size={22} /></div>
            <div>
              <p className="stat-label">Total Connections</p>
              <h2 className="stat-value">0</h2>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange"><Calendar size={22} /></div>
            <div>
              <p className="stat-label">Upcoming Meetings</p>
              <h2 className="stat-value">0</h2>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green"><TrendingUp size={22} /></div>
            <div>
              <p className="stat-label">Profile Views</p>
              <h2 className="stat-value">0</h2>
            </div>
          </div>
        </div>

        {/* Collaboration Requests */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Collaboration Requests</h2>
            <span className="badge">0 pending</span>
          </div>
          <div className="empty-state">
            <div className="empty-icon">!</div>
            <p>No collaboration requests yet</p>
            <span>When investors are interested in your startup, their requests will appear here</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EntrepreneurDashboard;