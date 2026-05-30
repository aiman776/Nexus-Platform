import { useState } from 'react';
import { Search, Filter, DollarSign, TrendingUp, Users, Calendar } from 'lucide-react';
import { Sidebar } from '../../Components/Sidebar';
import { useAuth } from '../../store/auth';
import './DealsPage.css';

const deals = [
  {
    id: 1,
    startup: {
      name: 'TechWave AI',
      industry: 'FinTech',
      initial: 'T'
    },
    amount: '$1.5M',
    equity: '15%',
    status: 'Due Diligence',
    stage: 'Series A',
    lastActivity: '2024-02-15'
  },
  {
    id: 2,
    startup: {
      name: 'GreenLife Solutions',
      industry: 'CleanTech',
      initial: 'G'
    },
    amount: '$2M',
    equity: '20%',
    status: 'Term Sheet',
    stage: 'Seed',
    lastActivity: '2024-02-10'
  },
  {
    id: 3,
    startup: {
      name: 'HealthPulse',
      industry: 'HealthTech',
      initial: 'H'
    },
    amount: '$800K',
    equity: '12%',
    status: 'Negotiation',
    stage: 'Pre-seed',
    lastActivity: '2024-02-05'
  }
];

const statuses = ['Due Diligence', 'Term Sheet', 'Negotiation', 'Closed', 'Passed'];

const getStatusClass = (status) => {
  switch (status) {
    case 'Due Diligence': return 'status-blue';
    case 'Term Sheet': return 'status-purple';
    case 'Negotiation': return 'status-orange';
    case 'Closed': return 'status-green';
    case 'Passed': return 'status-red';
    default: return 'status-gray';
  }
};

const DealsPage = () => {
  const { user } = useAuth();
  const role = user?.role || 'investor';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState([]);

  const toggleStatus = (status) => {
    setSelectedStatus(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const filteredDeals = deals.filter(deal => {
    const matchSearch =
      deal.startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.startup.industry.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus =
      selectedStatus.length === 0 || selectedStatus.includes(deal.status);

    return matchSearch && matchStatus;
  });

  return (
    <div className="dashboard-layout">
      <Sidebar role={role} />
      <main className="dashboard-main">

        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>Investment Deals</h1>
            <p>Track and manage your investment pipeline</p>
          </div>
          <button className="dashboard-btn">+ Add Deal</button>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue"><DollarSign size={20} /></div>
            <div>
              <p className="stat-label">Total Investment</p>
              <h2 className="stat-value">$4.3M</h2>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon teal"><TrendingUp size={20} /></div>
            <div>
              <p className="stat-label">Active Deals</p>
              <h2 className="stat-value">8</h2>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange"><Users size={20} /></div>
            <div>
              <p className="stat-label">Portfolio Companies</p>
              <h2 className="stat-value">12</h2>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green"><Calendar size={20} /></div>
            <div>
              <p className="stat-label">Closed This Month</p>
              <h2 className="stat-value">2</h2>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="deals-filters">
          <div className="deals-search">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search deals by startup name or industry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="deals-status-filters">
            <Filter size={18} color="#64748b" />
            {statuses.map(status => (
              <button
                key={status}
                className={`status-filter-btn ${getStatusClass(status)} ${selectedStatus.includes(status) ? 'selected' : ''}`}
                onClick={() => toggleStatus(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Deals Table */}
        <div className="deals-table-card">
          <div className="deals-table-header">
            <h2>Active Deals</h2>
          </div>

          <div className="deals-table-wrapper">
            <table className="deals-table">
              <thead>
                <tr>
                  <th>Startup</th>
                  <th>Amount</th>
                  <th>Equity</th>
                  <th>Status</th>
                  <th>Stage</th>
                  <th>Last Activity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeals.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="empty-row">No deals found</td>
                  </tr>
                ) : (
                  filteredDeals.map(deal => (
                    <tr key={deal.id}>
                      <td>
                        <div className="startup-cell">
                          <div className="startup-avatar">
                            {deal.startup.initial}
                          </div>
                          <div>
                            <p className="startup-name">{deal.startup.name}</p>
                            <p className="startup-industry">{deal.startup.industry}</p>
                          </div>
                        </div>
                      </td>
                      <td className="td-text">{deal.amount}</td>
                      <td className="td-text">{deal.equity}</td>
                      <td>
                        <span className={`status-badge ${getStatusClass(deal.status)}`}>
                          {deal.status}
                        </span>
                      </td>
                      <td className="td-text">{deal.stage}</td>
                      <td className="td-muted">
                        {new Date(deal.lastActivity).toLocaleDateString()}
                      </td>
                      <td className="td-actions">
                        <button className="view-btn">View Details</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
};

export default DealsPage;