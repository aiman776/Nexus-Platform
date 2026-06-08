import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageCircle, Building2, MapPin, UserCircle, BarChart3, Briefcase } from 'lucide-react';
import { useAuth } from '../../store/auth';
import { Sidebar } from '../../Components/Sidebar';
import './InvestorProfile.css';

const InvestorProfile = () => {
  const { id } = useParams();
  const { user: currentUser, token } = useAuth();
  const navigate = useNavigate();
  const role = currentUser?.role || 'entrepreneur';

  const [investor, setInvestor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvestor = async () => {
      try {
        const isMine = !id || id === 'mine' || id === currentUser?._id;
        const url = isMine
          ? `http://localhost:1000/api/investors/mine`
          : `http://localhost:1000/api/investors/${id}`;

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setInvestor(data.investor);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchInvestor();
  }, [id, token, currentUser?._id]);

  // ✅ Message button handler - conversation create karo
  const handleMessage = async () => {
    try {
      const receiverId = investor.user?._id || investor.user;
      const res = await fetch('http://localhost:1000/api/messages/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ receiverId }),
      });
      const data = await res.json();
      if (res.ok) {
        navigate('/messages');
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="dashboard-layout">
      <Sidebar role={role} />
      <main className="dashboard-main"><p>Loading...</p></main>
    </div>
  );

  if (!investor) return (
    <div className="dashboard-layout">
      <Sidebar role={role} />
      <main className="dashboard-main">
        <div className="not-found">
          <h2>Investor profile nahi mili</h2>
          <p>Pehle apna investor profile banao.</p>
          <button className="btn-blue" onClick={() => navigate(-1)}>← Go Back</button>
        </div>
      </main>
    </div>
  );

  const isCurrentUser = currentUser?._id === investor.user?._id || currentUser?._id === investor.user;

  return (
    <div className="dashboard-layout">
      <Sidebar role={role} />
      <main className="dashboard-main">

        <div className="ip-header-card">
          <div className="ip-header-left">
            <div className="ip-avatar-wrapper">
              <div className="ep-avatar-initials">
                {investor.name?.charAt(0).toUpperCase()}
              </div>
              <span className="ip-status online"></span>
            </div>
            <div className="ip-header-info">
              <h1>{investor.name}</h1>
              <p className="ip-subtitle">
                <Building2 size={15} /> Investor • {investor.totalInvestments} investments
              </p>
              <div className="ip-badges">
                <span className="ip-badge blue"><MapPin size={12} /> {investor.location || 'N/A'}</span>
                {investor.investmentStage?.map((stage, i) => (
                  <span key={i} className="ip-badge secondary">{stage}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="ip-header-actions">
            {/* ✅ Message button - conversation create karo */}
            {!isCurrentUser && (
              <button className="btn-blue" onClick={handleMessage}>
                <MessageCircle size={16} /> Message
              </button>
            )}
            {isCurrentUser && (
              <button className="btn-outline"><UserCircle size={16} /> Edit Profile</button>
            )}
          </div>
        </div>

        <div className="ip-grid">
          <div className="ip-left">
            <div className="ip-card">
              <div className="ip-card-header"><h2>About</h2></div>
              <div className="ip-card-body"><p>{investor.bio || 'N/A'}</p></div>
            </div>

            <div className="ip-card">
              <div className="ip-card-header"><h2>Investment Interests</h2></div>
              <div className="ip-card-body ip-interests">
                <div>
                  <h3>Industries</h3>
                  <div className="ip-tags">
                    {investor.investmentInterests?.map((interest, i) => (
                      <span key={i} className="ip-tag blue">{interest}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3>Investment Stages</h3>
                  <div className="ip-tags">
                    {investor.investmentStage?.map((stage, i) => (
                      <span key={i} className="ip-tag green">{stage}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3>Investment Criteria</h3>
                  <ul className="ip-criteria">
                    <li>Strong founding team with domain expertise</li>
                    <li>Clear market opportunity and product-market fit</li>
                    <li>Scalable business model with strong unit economics</li>
                    <li>Potential for significant growth and market impact</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="ip-card">
              <div className="ip-card-header">
                <h2>Portfolio Companies</h2>
                <span>{investor.portfolioCompanies?.length || 0} companies</span>
              </div>
              <div className="ip-card-body">
                <div className="ip-portfolio-grid">
                  {investor.portfolioCompanies?.length > 0 ? (
                    investor.portfolioCompanies.map((company, i) => (
                      <div key={i} className="ip-portfolio-item">
                        <div className="ip-portfolio-icon"><Briefcase size={17} /></div>
                        <div>
                          <h4>{company}</h4>
                          <p>Portfolio Company</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No portfolio companies yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="ip-right">
            <div className="ip-card">
              <div className="ip-card-header"><h2>Investment Details</h2></div>
              <div className="ip-card-body">
                <div className="ip-detail-item">
                  <span>Investment Range</span>
                  <strong>{investor.minimumInvestment} - {investor.maximumInvestment}</strong>
                </div>
                <div className="ip-detail-item">
                  <span>Total Investments</span>
                  <strong>{investor.totalInvestments} companies</strong>
                </div>
                <div className="ip-detail-item">
                  <span>Company</span>
                  <strong>{investor.company || 'N/A'}</strong>
                </div>
              </div>
            </div>

            <div className="ip-card">
              <div className="ip-card-header"><h2>Investment Stats</h2></div>
              <div className="ip-card-body">
                {[
                  { label: 'Total Investments', value: investor.totalInvestments },
                  { label: 'Portfolio Companies', value: investor.portfolioCompanies?.length || 0 },
                  { label: 'Investment Range', value: `${investor.minimumInvestment} - ${investor.maximumInvestment}` },
                ].map((stat, i) => (
                  <div key={i} className="ip-stat-item">
                    <div>
                      <h4>{stat.label}</h4>
                      <p>{stat.value}</p>
                    </div>
                    <BarChart3 size={24} />
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

export default InvestorProfile;