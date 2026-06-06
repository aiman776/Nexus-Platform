import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, PieChart, Filter, Search, PlusCircle, MapPin } from 'lucide-react';
import { Sidebar } from '../../Components/Sidebar';
import { useAuth } from '../../store/auth';
import './Dashboard.css';
import './InvestorDashboard.css';

const InvestorDashboard = () => {
  const { user, token } = useAuth();
  const role = user?.role || 'investor';

  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [connections, setConnections] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Startups fetch karo
        const res = await fetch('http://localhost:1000/api/startups', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setStartups(data.startups || []);

        // ✅ Accepted collaborations count karo
        const collabRes = await fetch('http://localhost:1000/api/collaborations/sent', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const collabData = await collabRes.json();
        if (collabRes.ok) {
          const accepted = collabData.requests?.filter(r => r.status === 'accepted').length || 0;
          setConnections(accepted);
        }

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token]);

  const allIndustries = [...new Set(startups.map(s => s.industry).filter(Boolean))];

  const toggleIndustry = (industry) => {
    setSelectedIndustries(prev =>
      prev.includes(industry) ? prev.filter(i => i !== industry) : [...prev, industry]
    );
  };

  const filteredStartups = startups.filter(s => {
    const matchSearch =
      searchQuery === '' ||
      s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.startupName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.industry?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.pitchSummary?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchIndustry =
      selectedIndustries.length === 0 || selectedIndustries.includes(s.industry);

    return matchSearch && matchIndustry;
  });

  return (
    <div className="dashboard-layout">
      <Sidebar role={role} />
      <main className="dashboard-main">

        <div className="dashboard-header">
          <div>
            <h1>Discover Startups</h1>
            <p>Find and connect with promising entrepreneurs</p>
          </div>
          <Link to="/find-startups">
            <button className="dashboard-btn">
              <PlusCircle size={18} /> View All Startups
            </button>
          </Link>
        </div>

        {/* Search + Filter */}
        <div className="id-search-row">
          <div className="id-search">
            <Search size={18} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search startups, industries, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="id-filters">
            <Filter size={16} color="#64748b" />
            <span>Filter by:</span>
            {allIndustries.map(industry => (
              <button
                key={industry}
                className={`id-filter-badge ${selectedIndustries.includes(industry) ? 'active' : ''}`}
                onClick={() => toggleIndustry(industry)}
              >
                {industry}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid stats-grid-3">
          <div className="stat-card">
            <div className="stat-icon blue"><Users size={20} /></div>
            <div>
              <p className="stat-label">Total Startups</p>
              <h2 className="stat-value">{startups.length}</h2>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon teal"><PieChart size={20} /></div>
            <div>
              <p className="stat-label">Industries</p>
              <h2 className="stat-value">{allIndustries.length}</h2>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange"><Users size={20} /></div>
            <div>
              <p className="stat-label">Your Connections</p>
              <h2 className="stat-value">{connections}</h2>
            </div>
          </div>
        </div>

        {/* Featured Startups */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Featured Startups</h2>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : filteredStartups.length === 0 ? (
            <div className="empty-state">
              <p>No startups match your filters</p>
              <button
                className="clear-btn"
                onClick={() => { setSearchQuery(''); setSelectedIndustries([]); }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="id-startups-grid">
              {filteredStartups.map(s => (
                <div key={s._id} className="id-startup-card">
                  <div className="id-card-top">
                    <div className="id-card-avatar">
                      {s.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3>{s.startupName}</h3>
                      <p>{s.name}</p>
                    </div>
                  </div>
                  <p className="id-card-pitch">{s.pitchSummary}</p>
                  <div className="id-card-tags">
                    {s.tags?.map(tag => (
                      <span key={tag} className="id-tag">{tag}</span>
                    ))}
                  </div>
                  <div className="id-card-meta">
                    <span><MapPin size={13} /> {s.location}</span>
                    <span>💰 {s.fundingNeeded}</span>
                    <span>📈 {s.stage}</span>
                  </div>
                  <div className="id-card-footer">
                    <span className={`id-industry-badge id-${s.industry?.toLowerCase().replace(' ', '')}`}>
                      {s.industry}
                    </span>
                    <Link to={`/entrepreneur/${s.user?._id || s.user}`}>
                      <button className="id-view-btn">View Profile</button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default InvestorDashboard;