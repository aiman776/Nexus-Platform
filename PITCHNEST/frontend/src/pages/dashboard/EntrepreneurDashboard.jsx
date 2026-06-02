import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Users, Calendar, TrendingUp, AlertCircle, PlusCircle } from 'lucide-react';
import { Sidebar } from '../../Components/Sidebar';
import { useAuth } from '../../store/auth';
import './Dashboard.css';
import './EntrepreneurDashboard.css';

const recommendedInvestors = [
  {
    id: '1',
    name: 'Michael Chen',
    initial: 'M',
    company: 'VC Innovate',
    interests: ['AI', 'FinTech', 'SaaS'],
    stage: 'Seed, Series A',
    investments: 12,
  },
  {
    id: '2',
    name: 'Emily Roberts',
    initial: 'E',
    company: 'GreenFund Capital',
    interests: ['CleanTech', 'Energy'],
    stage: 'Series A, Series B',
    investments: 8,
  },
  {
    id: '3',
    name: 'James Patel',
    initial: 'J',
    company: 'HealthVentures',
    interests: ['HealthTech', 'BioTech'],
    stage: 'Pre-seed, Seed',
    investments: 6,
  },
];

const EntrepreneurDashboard = () => {
  const { user } = useAuth();
  const role = user?.role || 'entrepreneur';

  const [requests, setRequests] = useState([
    {
      id: '1',
      investorName: 'Michael Chen',
      initial: 'M',
      company: 'VC Innovate',
      message: 'I am interested in your startup. Would love to discuss further.',
      status: 'pending',
      time: '2 hours ago',
    },
    {
      id: '2',
      investorName: 'Emily Roberts',
      initial: 'E',
      company: 'GreenFund Capital',
      message: 'Your pitch deck looks promising. Let us schedule a call.',
      status: 'pending',
      time: '1 day ago',
    },
  ]);

  const handleStatus = (id, status) => {
    setRequests(prev =>
      prev.map(req => req.id === id ? { ...req, status } : req)
    );
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const acceptedCount = requests.filter(r => r.status === 'accepted').length;

  return (
    <div className="dashboard-layout">
      <Sidebar role={role} />
      <main className="dashboard-main">

        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>Welcome, {user?.username || 'User'}</h1>
            <p>Here's what's happening with your startup today</p>
          </div>
          <Link to="/find-investors">
            <button className="dashboard-btn">
              <PlusCircle size={18} /> Find Investors
            </button>
          </Link>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue"><Bell size={22} /></div>
            <div>
              <p className="stat-label">Pending Requests</p>
              <h2 className="stat-value">{pendingCount}</h2>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon teal"><Users size={22} /></div>
            <div>
              <p className="stat-label">Total Connections</p>
              <h2 className="stat-value">{acceptedCount}</h2>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange"><Calendar size={22} /></div>
            <div>
              <p className="stat-label">Upcoming Meetings</p>
              <h2 className="stat-value">2</h2>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green"><TrendingUp size={22} /></div>
            <div>
              <p className="stat-label">Profile Views</p>
              <h2 className="stat-value">24</h2>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="ed-grid">

          {/* Left - Collaboration Requests */}
          <div className="ed-left">
            <div className="dashboard-section">
              <div className="section-header">
                <h2>Collaboration Requests</h2>
                <span className="badge">{pendingCount} pending</span>
              </div>

              {requests.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon"><AlertCircle size={24} /></div>
                  <p>No collaboration requests yet</p>
                  <span>When investors are interested in your startup, their requests will appear here</span>
                </div>
              ) : (
                <div className="collab-list">
                  {requests.map(req => (
                    <div key={req.id} className="collab-card">
                      <div className="collab-top">
                        <div className="collab-avatar">{req.initial}</div>
                        <div className="collab-info">
                          <h3>{req.investorName}</h3>
                          <p>{req.company}</p>
                        </div>
                        <span className={`collab-status status-${req.status}`}>
                          {req.status}
                        </span>
                      </div>
                      <p className="collab-message">{req.message}</p>
                      <div className="collab-footer">
                        <span className="collab-time">{req.time}</span>
                        {req.status === 'pending' && (
                          <div className="collab-actions">
                            <button
                              className="collab-btn accept"
                              onClick={() => handleStatus(req.id, 'accepted')}
                            >
                              Accept
                            </button>
                            <button
                              className="collab-btn reject"
                              onClick={() => handleStatus(req.id, 'rejected')}
                            >
                              Decline
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right - Recommended Investors */}
          <div className="ed-right">
            <div className="dashboard-section">
              <div className="section-header">
                <h2>Recommended Investors</h2>
                <Link to="/find-investors" className="view-all-link">View all</Link>
              </div>

              <div className="rec-list">
                {recommendedInvestors.map(investor => (
                  <div key={investor.id} className="rec-card">
                    <div className="rec-top">
                      <div className="rec-avatar">{investor.initial}</div>
                      <div>
                        <h3>{investor.name}</h3>
                        <p>{investor.company}</p>
                      </div>
                    </div>
                    <div className="rec-tags">
                      {investor.interests.map(tag => (
                        <span key={tag} className="rec-tag">{tag}</span>
                      ))}
                    </div>
                    <div className="rec-meta">
                      <span>📈 {investor.stage}</span>
                      <span>💼 {investor.investments} investments</span>
                    </div>
                    <Link to={`/investor/${investor.id}`}>
                      <button className="rec-btn">View Profile</button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EntrepreneurDashboard;