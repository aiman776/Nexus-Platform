import { useState, useEffect } from 'react';
import { Search, Filter, MapPin } from 'lucide-react';
import { Sidebar } from '../../Components/Sidebar';
import { useAuth } from '../../store/auth';
import './InvestorsPage.css';

const InvestorsPage = () => {
  const { user, token } = useAuth();
  const role = user?.role || 'entrepreneur';

  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStages, setSelectedStages] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');

  // ✅ Backend se investors fetch karo
useEffect(() => {
  const fetchInvestors = async () => {
    try {
      // ✅ Pehle investor profiles fetch karo
      const res = await fetch('http://localhost:1000/api/investors', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok && data.investors?.length > 0) {
        setInvestors(data.investors);
      } else {
        // ✅ Agar profiles nahi hain toh users fetch karo
        const userRes = await fetch('http://localhost:1000/api/investors/all-users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userRes.json();
        if (userRes.ok) {
          // ✅ User data ko investor format mein convert karo
          const converted = userData.investors.map(u => ({
            _id: u._id,
            name: u.username,
            company: 'N/A',
            location: u.location || 'N/A',
            bio: u.bio || 'Investor',
            investmentStage: [],
            investmentInterests: [],
            minimumInvestment: 'N/A',
            maximumInvestment: 'N/A',
            totalInvestments: 0,
            user: u._id,
          }));
          setInvestors(converted);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  if (token) fetchInvestors();
}, [token]);

  // ✅ Dynamic filters
  const allStages = [...new Set(investors.flatMap(i => i.investmentStage || []))];
  const allInterests = [...new Set(investors.flatMap(i => i.investmentInterests || []))];
  const allLocations = [...new Set(investors.map(i => i.location).filter(Boolean))];

  const toggleStage = (stage) => {
    setSelectedStages(prev =>
      prev.includes(stage) ? prev.filter(s => s !== stage) : [...prev, stage]
    );
  };

  const toggleInterest = (interest) => {
    setSelectedInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const filteredInvestors = investors.filter(investor => {
    const matchSearch =
      searchQuery === '' ||
      investor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investor.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investor.investmentInterests?.some(i =>
        i.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchStage =
      selectedStages.length === 0 ||
      investor.investmentStage?.some(s => selectedStages.includes(s));

    const matchInterest =
      selectedInterests.length === 0 ||
      investor.investmentInterests?.some(i => selectedInterests.includes(i));

    const matchLocation =
      selectedLocation === '' || investor.location === selectedLocation;

    return matchSearch && matchStage && matchInterest && matchLocation;
  });

  return (
    <div className="dashboard-layout">
      <Sidebar role={role} />
      <main className="dashboard-main">

        <div className="dashboard-header">
          <div>
            <h1>Find Investors</h1>
            <p>Connect with investors who match your startup's needs</p>
          </div>
        </div>

        <div className="find-layout">

          {/* Filters */}
          <div className="find-filters-card">
            <h2>Filters</h2>

            <div className="filter-section">
              <h3>Investment Stage</h3>
              {allStages.map(stage => (
                <button
                  key={stage}
                  className={`filter-btn ${selectedStages.includes(stage) ? 'active' : ''}`}
                  onClick={() => toggleStage(stage)}
                >
                  {stage}
                </button>
              ))}
            </div>

            <div className="filter-section">
              <h3>Investment Interests</h3>
              {allInterests.map(interest => (
                <button
                  key={interest}
                  className={`filter-btn ${selectedInterests.includes(interest) ? 'active' : ''}`}
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
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

          {/* Investors */}
          <div className="find-main">
            <div className="find-search-row">
              <div className="find-search">
                <Search size={18} color="#94a3b8" />
                <input
                  type="text"
                  placeholder="Search investors by name, interests, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="find-results">
                <Filter size={16} color="#94a3b8" />
                <span>{filteredInvestors.length} results</span>
              </div>
            </div>

            <div className="find-grid">
              {loading ? (
                <p>Loading...</p>
              ) : filteredInvestors.length === 0 ? (
                <div className="empty-state"><p>No investors found</p></div>
              ) : (
                filteredInvestors.map(investor => (
                  <div className="startup-card" key={investor._id}>
                    <div className="startup-card-top">
                      <div className="startup-card-avatar">
                        {investor.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3>{investor.name}</h3>
                        <p className="startup-card-name">{investor.company}</p>
                      </div>
                    </div>

                    <p className="startup-card-pitch">{investor.bio}</p>

                    <div className="startup-card-tags">
                      {investor.investmentInterests?.map(interest => (
                        <span key={interest} className="startup-tag">{interest}</span>
                      ))}
                    </div>

                    <div className="startup-card-meta">
                      <span className="meta-item"><MapPin size={13} /> {investor.location}</span>
                      <span className="meta-item">📈 {investor.investmentStage?.join(', ')}</span>
                    </div>

                    <div className="startup-card-footer">
                      <span className="industry-badge industry-fintech">Investor</span>
                      <button
                        className="connect-btn"
                        onClick={() => window.location.href = `/investor/${investor._id}`}
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

export default InvestorsPage;