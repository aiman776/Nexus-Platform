import { Sidebar } from "../../Components/Sidebar";
import { useAuth } from "../../store/auth";
import { Users, TrendingUp, UserCheck } from "lucide-react";
import "./Dashboard.css";

const InvestorDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-layout">
      <Sidebar role="investor" />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1>Discover Startups</h1>
            <p>Find and connect with promising entrepreneurs</p>
          </div>
          <button className="dashboard-btn">+ View All Startups</button>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid stats-grid-3">
          <div className="stat-card">
            <div className="stat-icon blue"><Users size={22} /></div>
            <div>
              <p className="stat-label">Total Startups</p>
              <h2 className="stat-value">0</h2>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon teal"><TrendingUp size={22} /></div>
            <div>
              <p className="stat-label">Industries</p>
              <h2 className="stat-value">0</h2>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange"><UserCheck size={22} /></div>
            <div>
              <p className="stat-label">Your Connections</p>
              <h2 className="stat-value">0</h2>
            </div>
          </div>
        </div>

        {/* Featured Startups */}
        <div className="dashboard-section">
          <h2>Featured Startups</h2>
          <div className="empty-state">
            <p>No startups found yet</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InvestorDashboard;