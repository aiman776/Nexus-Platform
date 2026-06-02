import { useParams, Link, useNavigate } from 'react-router-dom';
import { MessageCircle, Building2, MapPin, UserCircle, BarChart3, Briefcase } from 'lucide-react';
import { useAuth } from '../../store/auth';
import { Sidebar } from '../../Components/Sidebar';
import './InvestorProfile.css';

const investorsData = [
  {
    id: '1',
    name: 'Michael Chen',
    role: 'investor',
    avatarUrl: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg',
    isOnline: true,
    company: 'VC Innovate',
    location: 'San Francisco, CA',
    totalInvestments: 12,
    investmentStage: ['Seed', 'Series A'],
    investmentInterests: ['AI', 'FinTech', 'SaaS'],
    minimumInvestment: '$500K',
    maximumInvestment: '$5M',
    bio: 'Focused on early-stage tech startups with strong market potential. 15+ years in venture capital.',
    portfolioCompanies: ['TechWave AI', 'PayFlow', 'DataSync', 'CloudBase'],
  },
  {
    id: '2',
    name: 'Emily Roberts',
    role: 'investor',
    avatarUrl: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    isOnline: false,
    company: 'GreenFund Capital',
    location: 'New York, NY',
    totalInvestments: 8,
    investmentStage: ['Series A', 'Series B'],
    investmentInterests: ['CleanTech', 'Energy', 'ESG'],
    minimumInvestment: '$1M',
    maximumInvestment: '$10M',
    bio: 'Investing in sustainable and clean energy solutions globally. Passionate about climate tech.',
    portfolioCompanies: ['GreenLife', 'SolarEdge', 'EcoFlow'],
  },
];

const InvestorProfile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const role = currentUser?.role || 'entrepreneur';

  const investor = investorsData.find(i => i.id === id);

  if (!investor) {
    return (
      <div className="dashboard-layout">
        <Sidebar role={role} />
        <main className="dashboard-main">
          <div className="not-found">
            <h2>Investor not found</h2>
            <p>The investor profile you're looking for doesn't exist.</p>
            <button className="btn-blue" onClick={() => navigate(-1)}>← Go Back</button>
          </div>
        </main>
      </div>
    );
  }

  const isCurrentUser = currentUser?.id === investor.id;

  return (
    <div className="dashboard-layout">
      <Sidebar role={role} />
      <main className="dashboard-main">

        {/* ===== PROFILE HEADER ===== */}
        <div className="ip-header-card">
          <div className="ip-header-left">
            <div className="ip-avatar-wrapper">
              <img src={investor.avatarUrl} alt={investor.name} className="ip-avatar" />
              <span className={`ip-status ${investor.isOnline ? 'online' : 'offline'}`}></span>
            </div>

            <div className="ip-header-info">
              <h1>{investor.name}</h1>
              <p className="ip-subtitle">
                <Building2 size={15} /> Investor • {investor.totalInvestments} investments
              </p>
              <div className="ip-badges">
                <span className="ip-badge blue"><MapPin size={12} /> {investor.location}</span>
                {investor.investmentStage.map((stage, i) => (
                  <span key={i} className="ip-badge secondary">{stage}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="ip-header-actions">
            {!isCurrentUser && (
              <Link to={`/chat/${investor.id}`}>
                <button className="btn-blue"><MessageCircle size={16} /> Message</button>
              </Link>
            )}
            {isCurrentUser && (
              <button className="btn-outline"><UserCircle size={16} /> Edit Profile</button>
            )}
          </div>
        </div>

        {/* ===== MAIN GRID ===== */}
        <div className="ip-grid">

          {/* LEFT SIDE */}
          <div className="ip-left">

            {/* About */}
            <div className="ip-card">
              <div className="ip-card-header"><h2>About</h2></div>
              <div className="ip-card-body">
                <p>{investor.bio}</p>
              </div>
            </div>

            {/* Investment Interests */}
            <div className="ip-card">
              <div className="ip-card-header"><h2>Investment Interests</h2></div>
              <div className="ip-card-body ip-interests">

                <div>
                  <h3>Industries</h3>
                  <div className="ip-tags">
                    {investor.investmentInterests.map((interest, i) => (
                      <span key={i} className="ip-tag blue">{interest}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3>Investment Stages</h3>
                  <div className="ip-tags">
                    {investor.investmentStage.map((stage, i) => (
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

            {/* Portfolio Companies */}
            <div className="ip-card">
              <div className="ip-card-header">
                <h2>Portfolio Companies</h2>
                <span>{investor.portfolioCompanies.length} companies</span>
              </div>
              <div className="ip-card-body">
                <div className="ip-portfolio-grid">
                  {investor.portfolioCompanies.map((company, i) => (
                    <div key={i} className="ip-portfolio-item">
                      <div className="ip-portfolio-icon"><Briefcase size={17} /></div>
                      <div>
                        <h4>{company}</h4>
                        <p>Invested in 2022</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="ip-right">

            {/* Investment Details */}
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
                  <span>Typical Timeline</span>
                  <strong>3-5 years</strong>
                </div>

                <div className="ip-focus">
                  <span>Investment Focus</span>
                  {[
                    { label: 'SaaS & B2B', pct: '75%' },
                    { label: 'FinTech',    pct: '60%' },
                    { label: 'HealthTech', pct: '40%' },
                  ].map((item, i) => (
                    <div key={i} className="ip-progress-row">
                      <p>{item.label}</p>
                      <div className="ip-progress-bar">
                        <div className="ip-progress-fill" style={{ width: item.pct }}></div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* Stats */}
            <div className="ip-card">
              <div className="ip-card-header"><h2>Investment Stats</h2></div>
              <div className="ip-card-body">
                {[
                  { label: 'Successful Exits',   value: '4' },
                  { label: 'Avg. ROI',            value: '3.2x' },
                  { label: 'Active Investments',  value: investor.portfolioCompanies.length },
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
