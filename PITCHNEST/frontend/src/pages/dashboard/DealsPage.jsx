import { useState, useEffect } from 'react';
import { Search, Filter, DollarSign, TrendingUp, Users, Calendar, Plus, X } from 'lucide-react';
import { Sidebar } from '../../Components/Sidebar';
import { useAuth } from '../../store/auth';
import './DealsPage.css';

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
  const { user, token } = useAuth();
  const role = user?.role || 'investor';

  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    startup: { name: '', industry: '' },
    amount: '',
    equity: '',
    stage: '',
    status: 'Due Diligence',
  });

  // ✅ Fetch deals
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await fetch('http://localhost:1000/api/deals/my-deals', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setDeals(data.deals || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchDeals();
  }, [token]);

  // ✅ Add deal
  const handleAddDeal = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:1000/api/deals/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setDeals(prev => [data.deal, ...prev]);
        setShowForm(false);
        setFormData({ startup: { name: '', industry: '' }, amount: '', equity: '', stage: '', status: 'Due Diligence' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Update status
  const handleStatusUpdate = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:1000/api/deals/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setDeals(prev => prev.map(d => d._id === id ? { ...d, status } : d));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Delete deal
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this deal?')) return;
    try {
      const res = await fetch(`http://localhost:1000/api/deals/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setDeals(prev => prev.filter(d => d._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = (status) => {
    setSelectedStatus(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const filteredDeals = deals.filter(deal => {
    const matchSearch =
      searchQuery === '' ||
      deal.startup?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.startup?.industry?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus =
      selectedStatus.length === 0 || selectedStatus.includes(deal.status);
    return matchSearch && matchStatus;
  });

  const totalAmount = deals
    .filter(d => d.status === 'Closed')
    .reduce((acc, d) => acc + parseFloat(d.amount?.replace(/[^0-9.]/g, '') || 0), 0);

  return (
    <div className="dashboard-layout">
      <Sidebar role={role} />
      <main className="dashboard-main">

        <div className="dashboard-header">
          <div>
            <h1>Investment Deals</h1>
            <p>Track and manage your investment pipeline</p>
          </div>
          <button className="dashboard-btn" onClick={() => setShowForm(!showForm)}>
            <Plus size={18} /> Add Deal
          </button>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue"><DollarSign size={20} /></div>
            <div>
              <p className="stat-label">Total Deals</p>
              <h2 className="stat-value">{deals.length}</h2>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon teal"><TrendingUp size={20} /></div>
            <div>
              <p className="stat-label">Active Deals</p>
              <h2 className="stat-value">{deals.filter(d => d.status !== 'Closed' && d.status !== 'Passed').length}</h2>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange"><Users size={20} /></div>
            <div>
              <p className="stat-label">Closed Deals</p>
              <h2 className="stat-value">{deals.filter(d => d.status === 'Closed').length}</h2>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green"><Calendar size={20} /></div>
            <div>
              <p className="stat-label">This Month</p>
              <h2 className="stat-value">
                {deals.filter(d => new Date(d.createdAt).getMonth() === new Date().getMonth()).length}
              </h2>
            </div>
          </div>
        </div>

        {/* Add Deal Form */}
        {showForm && (
          <div className="meet-form-card">
            <h2>Add New Deal</h2>
            <form onSubmit={handleAddDeal} className="meet-form">
              <div className="meet-form-grid">
                <div className="form-group">
                  <label>Startup Name</label>
                  <input
                    type="text"
                    placeholder="TechWave AI"
                    value={formData.startup.name}
                    onChange={e => setFormData({ ...formData, startup: { ...formData.startup, name: e.target.value } })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Industry</label>
                  <input
                    type="text"
                    placeholder="FinTech"
                    value={formData.startup.industry}
                    onChange={e => setFormData({ ...formData, startup: { ...formData.startup, industry: e.target.value } })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Amount</label>
                  <input
                    type="text"
                    placeholder="$1.5M"
                    value={formData.amount}
                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Equity</label>
                  <input
                    type="text"
                    placeholder="15%"
                    value={formData.equity}
                    onChange={e => setFormData({ ...formData, equity: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Stage</label>
                  <input
                    type="text"
                    placeholder="Series A"
                    value={formData.stage}
                    onChange={e => setFormData({ ...formData, stage: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                  >
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="meet-form-actions">
                <button type="submit" className="dashboard-btn">Add Deal</button>
                <button type="button" className="meet-cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="deals-filters">
          <div className="deals-search">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search deals..."
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
                {loading ? (
                  <tr><td colSpan="7" className="empty-row">Loading...</td></tr>
                ) : filteredDeals.length === 0 ? (
                  <tr><td colSpan="7" className="empty-row">No deals found</td></tr>
                ) : (
                  filteredDeals.map(deal => (
                    <tr key={deal._id}>
                      <td>
                        <div className="startup-cell">
                          <div className="startup-avatar">
                            {deal.startup?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="startup-name">{deal.startup?.name}</p>
                            <p className="startup-industry">{deal.startup?.industry}</p>
                          </div>
                        </div>
                      </td>
                      <td className="td-text">{deal.amount}</td>
                      <td className="td-text">{deal.equity}</td>
                      <td>
                        <select
                          className={`status-badge ${getStatusClass(deal.status)}`}
                          value={deal.status}
                          onChange={e => handleStatusUpdate(deal._id, e.target.value)}
                        >
                          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="td-text">{deal.stage}</td>
                      <td className="td-muted">
                        {new Date(deal.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="td-actions">
                        <button className="view-btn danger" onClick={() => handleDelete(deal._id)}>
                          <X size={14} /> Delete
                        </button>
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