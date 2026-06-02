import { useState } from 'react';
import { Search, Filter, MapPin } from 'lucide-react';
import { Sidebar } from '../../Components/Sidebar';
import { useAuth } from '../../store/auth';
import './InvestorsPage.css';

const investorsData = [
  {
    id: 1,
    name: 'Michael Chen',
    company: 'VC Innovate',
    location: 'San Francisco, CA',
    investmentStage: ['Seed', 'Series A'],
    bio: 'Focused on early-stage tech startups with strong market potential.',
    investmentInterests: ['AI', 'FinTech', 'SaaS'],
  },
  {
    id: 2,
    name: 'Emily Roberts',
    company: 'GreenFund Capital',
    location: 'New York, NY',
    investmentStage: ['Series A', 'Series B'],
    bio: 'Investing in sustainable and clean energy solutions globally.',
    investmentInterests: ['CleanTech', 'Energy', 'ESG'],
  },
  {
    id: 3,
    name: 'James Patel',
    company: 'HealthVentures',
    location: 'Boston, MA',
    investmentStage: ['Pre-seed', 'Seed'],
    bio: 'Healthcare and biotech specialist with 15 years of experience.',
    investmentInterests: ['HealthTech', 'BioTech', 'MedDevice'],
  },
  {
    id: 4,
    name: 'Laura Kim',
    company: 'AgriGrowth Partners',
    location: 'Boston, MA',
    investmentStage: ['Series A', 'Series B'],
    bio: 'Supporting AgTech and food innovation startups across North America.',
    investmentInterests: ['AgTech', 'FoodTech', 'IoT'],
  },
];

const allStages = [...new Set(investorsData.flatMap(i => i.investmentStage))];
const allInterests = [...new Set(investorsData.flatMap(i => i.investmentInterests))];
const locations = ['San Francisco, CA', 'New York, NY', 'Boston, MA'];

const InvestorsPage = () => {
  const { user } = useAuth();
  const role = user?.role || 'entrepreneur';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStages, setSelectedStages] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');

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

  const filteredInvestors = investorsData.filter(investor => {
    const matchSearch =
      searchQuery === '' ||
      investor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investor.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investor.investmentInterests.some(i =>
        i.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchStage =
      selectedStages.length === 0 ||
      investor.investmentStage.some(s => selectedStages.includes(s));

    const matchInterest =
      selectedInterests.length === 0 ||
      investor.investmentInterests.some(i => selectedInterests.includes(i));

    const matchLocation =
      selectedLocation === '' || investor.location === selectedLocation;

    return matchSearch && matchStage && matchInterest && matchLocation;
  });

  return (
    <div className="dashboard-layout">
      <Sidebar role={role} />
      <main className="dashboard-main">

        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>Find Investors</h1>
            <p>Connect with investors who match your startup's needs</p>
          </div>
        </div>

        <div className="find-layout">

          {/* Left - Filters */}
          <div className="find-filters-card">
            <h2>Filters</h2>

            {/* Investment Stage */}
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

            {/* Investment Interests */}
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

          {/* Right - Investors */}
          <div className="find-main">

            {/* Search */}
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

            {/* Cards */}
            <div className="find-grid">
              {filteredInvestors.length === 0 ? (
                <div className="empty-state">
                  <p>No investors found</p>
                </div>
              ) : (
                filteredInvestors.map(investor => (
                  <div className="startup-card" key={investor.id}>

                    <div className="startup-card-top">
                      <div className="startup-card-avatar">
                        {investor.name.charAt(0)}
                      </div>
                      <div>
                        <h3>{investor.name}</h3>
                        <p className="startup-card-name">{investor.company}</p>
                      </div>
                    </div>

                    <p className="startup-card-pitch">{investor.bio}</p>

                    <div className="startup-card-tags">
                      {investor.investmentInterests.map(interest => (
                        <span key={interest} className="startup-tag">{interest}</span>
                      ))}
                    </div>

                    <div className="startup-card-meta">
                      <span className="meta-item"><MapPin size={13} /> {investor.location}</span>
                      <span className="meta-item">📈 {investor.investmentStage.join(', ')}</span>
                    </div>

                    <div className="startup-card-footer">
                      <span className="industry-badge industry-fintech">Investor</span>
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

export default InvestorsPage;
