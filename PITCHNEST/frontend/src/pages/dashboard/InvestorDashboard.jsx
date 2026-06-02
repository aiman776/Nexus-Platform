import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, PieChart, Filter, Search, PlusCircle, MapPin } from 'lucide-react';
import { Sidebar } from '../../Components/Sidebar';
import { useAuth } from '../../store/auth';
import './Dashboard.css';
import './InvestorDashboard.css';

const entrepreneursData = [
  {
    id: '1',
    name: 'Sarah Johnson',
    initial: 'S',
    startupName: 'TechWave AI',
    industry: 'FinTech',
    location: 'San Francisco, CA',
    fundingNeeded: '$1.5M',
    stage: 'Series A',
    pitchSummary: 'AI-powered financial analytics platform for small businesses.',
    tags: ['AI', 'Finance', 'B2B'],
  },
  {
    id: '2',
    name: 'David Chen',
    initial: 'D',
    startupName: 'GreenLife Solutions',
    industry: 'CleanTech',
    location: 'Portland, OR',
    fundingNeeded: '$2M',
    stage: 'Seed',
    pitchSummary: 'Sustainable energy solutions for residential and commercial use.',
    tags: ['Green', 'Energy', 'Sustainability'],
  },
  {
    id: '3',
    name: 'Maya Patel',
    initial: 'M',
    startupName: 'HealthPulse',
    industry: 'HealthTech',
    location: 'Boston, MA',
    fundingNeeded: '$800K',
    stage: 'Pre-seed',
    pitchSummary: 'Remote patient monitoring platform using wearable technology.',
    tags: ['Health', 'IoT', 'B2C'],
  },
  {
    id: '4',
    name: 'James Wilson',
    initial: 'J',
    startupName: 'AgriSmart',
    industry: 'AgTech',
    location: 'Austin, TX',
    fundingNeeded: '$3M',
    stage: 'Series A',
    pitchSummary: 'Smart farming solutions using IoT and machine learning.',
    tags: ['Agriculture', 'IoT', 'ML'],
  },
];

const allIndustries = [...new Set(entrepreneursData.map(e => e.industry))];

const InvestorDashboard = () => {
  const { user } = useAuth();
  const role = user?.role || 'investor';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [connections] = useState(0);

  const toggleIndustry = (industry) => {
    setSelectedIndustries(prev =>
      prev.includes(industry)
        ? prev.filter(i => i !== industry)
        : [...prev, industry]
    );
  };

  const filteredEntrepreneurs = entrepreneursData.filter(e => {
    const matchSearch =
      searchQuery === '' ||
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.pitchSummary.toLowerCase().includes(searchQuery.toLowerCase());

    const matchIndustry =
      selectedIndustries.length === 0 || selectedIndustries.includes(e.industry);

    return matchSearch && matchIndustry;
  });

  return (
    <div className="dashboard-layout">
      <Sidebar role={role} />
      <main className="dashboard-main">

        {/* Header */}
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
              <h2 className="stat-value">{entrepreneursData.length}</h2>
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

          {filteredEntrepreneurs.length === 0 ? (
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
              {filteredEntrepreneurs.map(e => (
                <div key={e.id} className="id-startup-card">
                  <div className="id-card-top">
                    <div className="id-card-avatar">{e.initial}</div>
                    <div>
                      <h3>{e.startupName}</h3>
                      <p>{e.name}</p>
                    </div>
                  </div>

                  <p className="id-card-pitch">{e.pitchSummary}</p>

                  <div className="id-card-tags">
                    {e.tags.map(tag => (
                      <span key={tag} className="id-tag">{tag}</span>
                    ))}
                  </div>

                  <div className="id-card-meta">
                    <span><MapPin size={13} /> {e.location}</span>
                    <span>💰 {e.fundingNeeded}</span>
                    <span>📈 {e.stage}</span>
                  </div>

                  <div className="id-card-footer">
                    <span className={`id-industry-badge id-${e.industry.toLowerCase().replace(' ', '')}`}>
                      {e.industry}
                    </span>
                    <Link to={`/entrepreneur/${e.id}`}>
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