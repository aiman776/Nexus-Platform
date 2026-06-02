import { useState } from 'react';
import { Search, Filter, MapPin } from 'lucide-react';
import { Sidebar } from '../../Components/Sidebar';
import { useAuth } from '../../store/auth';
import './FindStartupsPage.css';

const startupsData = [
  {
    id: 1,
    name: 'Sarah Johnson',
    initial: 'S',
    startupName: 'TechWave AI',
    industry: 'FinTech',
    location: 'San Francisco, CA',
    fundingNeeded: '$1.5M',
    fundingAmount: 1500,
    stage: 'Series A',
    pitchSummary: 'AI-powered financial analytics platform for small businesses.',
    tags: ['AI', 'Finance', 'B2B'],
  },
  {
    id: 2,
    name: 'David Chen',
    initial: 'D',
    startupName: 'GreenLife Solutions',
    industry: 'CleanTech',
    location: 'Portland, OR',
    fundingNeeded: '$2M',
    fundingAmount: 2000,
    stage: 'Seed',
    pitchSummary: 'Sustainable energy solutions for residential and commercial use.',
    tags: ['Green', 'Energy', 'Sustainability'],
  },
  {
    id: 3,
    name: 'Maya Patel',
    initial: 'M',
    startupName: 'HealthPulse',
    industry: 'HealthTech',
    location: 'Boston, MA',
    fundingNeeded: '$800K',
    fundingAmount: 800,
    stage: 'Pre-seed',
    pitchSummary: 'Remote patient monitoring platform using wearable technology.',
    tags: ['Health', 'IoT', 'B2C'],
  },
  {
    id: 4,
    name: 'James Wilson',
    initial: 'J',
    startupName: 'AgriSmart',
    industry: 'AgTech',
    location: 'Austin, TX',
    fundingNeeded: '$3M',
    fundingAmount: 3000,
    stage: 'Series A',
    pitchSummary: 'Smart farming solutions using IoT and machine learning.',
    tags: ['Agriculture', 'IoT', 'ML'],
  },
];

const allIndustries = [...new Set(startupsData.map(s => s.industry))];
const fundingRanges = ['< $500K', '$500K - $1M', '$1M - $5M', '> $5M'];
const locations = ['San Francisco, CA', 'New York, NY', 'Boston, MA', 'Portland, OR', 'Austin, TX'];

const FindStartupsPage = () => {
  const { user } = useAuth();
  const role = user?.role || 'investor';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [selectedFunding, setSelectedFunding] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');

  const toggleIndustry = (industry) => {
    setSelectedIndustries(prev =>
      prev.includes(industry) ? prev.filter(i => i !== industry) : [...prev, industry]
    );
  };

  const toggleFunding = (range) => {
    setSelectedFunding(prev =>
      prev.includes(range) ? prev.filter(r => r !== range) : [...prev, range]
    );
  };

  const filteredStartups = startupsData.filter(s => {
    const matchSearch =
      searchQuery === '' ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.pitchSummary.toLowerCase().includes(searchQuery.toLowerCase());

    const matchIndustry =
      selectedIndustries.length === 0 || selectedIndustries.includes(s.industry);

    const matchFunding =
      selectedFunding.length === 0 ||
      selectedFunding.some(range => {
        const amt = s.fundingAmount;
        switch (range) {
          case '< $500K': return amt < 500;
          case '$500K - $1M': return amt >= 500 && amt <= 1000;
          case '$1M - $5M': return amt > 1000 && amt <= 5000;
          case '> $5M': return amt > 5000;
          default: return true;
        }
      });

    const matchLocation =
      selectedLocation === '' || s.location === selectedLocation;

    return matchSearch && matchIndustry && matchFunding && matchLocation;
  });

  return (
    <div className="dashboard-layout">
      <Sidebar role={role} />
      <main className="dashboard-main">

        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>Find Startups</h1>
            <p>Discover promising startups looking for investment</p>
          </div>
        </div>

        <div className="find-layout">

          {/* Left - Filters */}
          <div className="find-filters-card">
            <h2>Filters</h2>

            {/* Industry */}
            <div className="filter-section">
              <h3>Industry</h3>
              {allIndustries.map(industry => (
                <button
                  key={industry}
                  className={`filter-btn ${selectedIndustries.includes(industry) ? 'active' : ''}`}
                  onClick={() => toggleIndustry(industry)}
                >
                  {industry}
                </button>
              ))}
            </div>

            {/* Funding Range */}
            <div className="filter-section">
              <h3>Funding Range</h3>
              {fundingRanges.map(range => (
                <button
                  key={range}
                  className={`filter-btn ${selectedFunding.includes(range) ? 'active' : ''}`}
                  onClick={() => toggleFunding(range)}
                >
                  {range}
                </button>
              ))}
            </div>

            {/* Location */}
            <div className="filter-section">
              <h3>Location</h3>
              {locations.map(loc => (
                <button
                  key={loc}
                  className={`filter-btn ${selectedLocation === loc ? 'active' : ''}`}
                  onClick={() => setSelectedLocation(selectedLocation === loc ? '' : loc)}
                >
                  <MapPin size={14} /> {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Right - Startups */}
          <div className="find-main">

            {/* Search */}
            <div className="find-search-row">
              <div className="find-search">
                <Search size={18} color="#94a3b8" />
                <input
                  type="text"
                  placeholder="Search startups by name, industry, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="find-results">
                <Filter size={16} color="#94a3b8" />
                <span>{filteredStartups.length} results</span>
              </div>
            </div>

            {/* Cards */}
            <div className="find-grid">
              {filteredStartups.length === 0 ? (
                <div className="empty-state">
                  <p>No startups found</p>
                </div>
              ) : (
                filteredStartups.map(startup => (
                  <div className="startup-card" key={startup.id}>
                    <div className="startup-card-top">
                      <div className="startup-card-avatar">{startup.initial}</div>
                      <div>
                        <h3>{startup.startupName}</h3>
                        <p className="startup-card-name">{startup.name}</p>
                      </div>
                    </div>

                    <p className="startup-card-pitch">{startup.pitchSummary}</p>

                    <div className="startup-card-tags">
                      {startup.tags.map(tag => (
                        <span key={tag} className="startup-tag">{tag}</span>
                      ))}
                    </div>

                    <div className="startup-card-meta">
                      <span className="meta-item">
                        <MapPin size={13} /> {startup.location}
                      </span>
                      <span className="meta-item">💰 {startup.fundingNeeded}</span>
                      <span className="meta-item">📈 {startup.stage}</span>
                    </div>

                    <div className="startup-card-footer">
                      <span className={`industry-badge industry-${startup.industry.toLowerCase().replace(' ', '')}`}>
                        {startup.industry}
                      </span>
                      <button className="connect-btn">Connect</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FindStartupsPage;