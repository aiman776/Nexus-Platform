import { useState, useEffect } from 'react';
import { Search, Filter, MapPin } from 'lucide-react';
import { Sidebar } from '../../Components/Sidebar';
import { useAuth } from '../../store/auth';
import './FindStartupsPage.css';

const fundingRanges = ['< $500K', '$500K - $1M', '$1M - $5M', '> $5M'];

const FindStartupsPage = () => {
  const { user, token } = useAuth();
  const role = user?.role || 'investor';

  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [selectedFunding, setSelectedFunding] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');

  // ✅ Backend se startups fetch karo
  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const res = await fetch('http://localhost:1000/api/startups', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setStartups(data.startups || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchStartups();
  }, [token]);

  // ✅ Dynamic filters backend data se
  const allIndustries = [...new Set(startups.map(s => s.industry).filter(Boolean))];
  const allLocations = [...new Set(startups.map(s => s.location).filter(Boolean))];

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

  const filteredStartups = startups.filter(s => {
    const matchSearch =
      searchQuery === '' ||
      s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.startupName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.industry?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.pitchSummary?.toLowerCase().includes(searchQuery.toLowerCase());

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

        <div className="dashboard-header">
          <div>
            <h1>Find Startups</h1>
            <p>Discover promising startups looking for investment</p>
          </div>
        </div>

        <div className="find-layout">

          {/* Filters */}
          <div className="find-filters-card">
            <h2>Filters</h2>

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

            <div className="filter-section">
              <h3>Location</h3>
              {allLocations.map(loc => (
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

          {/* Startups */}
          <div className="find-main">
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

            <div className="find-grid">
              {loading ? (
                <p>Loading...</p>
              ) : filteredStartups.length === 0 ? (
                <div className="empty-state"><p>No startups found</p></div>
              ) : (
                filteredStartups.map(startup => (
                  <div className="startup-card" key={startup._id}>
                    <div className="startup-card-top">
                      <div className="startup-card-avatar">
                        {startup.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3>{startup.startupName}</h3>
                        <p className="startup-card-name">{startup.name}</p>
                      </div>
                    </div>

                    <p className="startup-card-pitch">{startup.pitchSummary}</p>

                    <div className="startup-card-tags">
                      {startup.tags?.map(tag => (
                        <span key={tag} className="startup-tag">{tag}</span>
                      ))}
                    </div>

                    <div className="startup-card-meta">
                      <span className="meta-item"><MapPin size={13} /> {startup.location}</span>
                      <span className="meta-item">💰 {startup.fundingNeeded}</span>
                      <span className="meta-item">📈 {startup.stage}</span>
                    </div>

                    <div className="startup-card-footer">
                      <span className={`industry-badge industry-${startup.industry?.toLowerCase().replace(' ', '')}`}>
                        {startup.industry}
                      </span>
                      <button
                        className="connect-btn"
                        onClick={() => window.location.href = `/entrepreneur/${startup.user?._id || startup.user}`}
                      >
                        View Profile
                      </button>
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