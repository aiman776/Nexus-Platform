import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MessageCircle, Users, Calendar, Building2, MapPin, UserCircle, FileText, DollarSign, Send } from 'lucide-react';
import { useAuth } from '../../store/auth';
import { Sidebar } from '../../Components/Sidebar';
import './EntrepreneurProfile.css';

// Demo data
const entrepreneursData = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'entrepreneur',
    avatarUrl: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    isOnline: true,
    startupName: 'TechWave AI',
    industry: 'FinTech',
    location: 'San Francisco, CA',
    foundedYear: 2021,
    teamSize: 8,
    bio: 'Passionate entrepreneur building AI-powered financial tools for small businesses. 10+ years in fintech.',
    pitchSummary: 'Small businesses lack access to enterprise-grade financial analytics. TechWave AI provides affordable, AI-powered financial analytics platform that helps small businesses make smarter decisions.',
    fundingNeeded: '$1.5M',
  },
  {
    id: '2',
    name: 'David Chen',
    role: 'entrepreneur',
    avatarUrl: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg',
    isOnline: false,
    startupName: 'GreenLife Solutions',
    industry: 'CleanTech',
    location: 'Portland, OR',
    foundedYear: 2020,
    teamSize: 5,
    bio: 'Environmental engineer turned entrepreneur. On a mission to make sustainable energy affordable for everyone.',
    pitchSummary: 'Fossil fuels dominate residential energy. GreenLife Solutions offers plug-and-play sustainable energy kits for homes and businesses at 40% lower cost than competitors.',
    fundingNeeded: '$2M',
  },
];

const EntrepreneurProfile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const role = currentUser?.role || 'investor';

  const [requestSent, setRequestSent] = useState(false);

  const entrepreneur = entrepreneursData.find(e => e.id === id);

  if (!entrepreneur) {
    return (
      <div className="dashboard-layout">
        <Sidebar role={role} />
        <main className="dashboard-main">
          <div className="not-found">
            <h2>Entrepreneur not found</h2>
            <p>The profile you're looking for doesn't exist.</p>
            <button className="btn-blue" onClick={() => navigate(-1)}>← Go Back</button>
          </div>
        </main>
      </div>
    );
  }

  const isCurrentUser = currentUser?.id === entrepreneur.id;
  const isInvestor = currentUser?.role === 'investor';

  const handleSendRequest = () => {
    setRequestSent(true);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar role={role} />
      <main className="dashboard-main">

        {/* ===== PROFILE HEADER CARD ===== */}
        <div className="ep-header-card">
          <div className="ep-header-left">
            <div className="ep-avatar-wrapper">
              <img
                src={entrepreneur.avatarUrl}
                alt={entrepreneur.name}
                className="ep-avatar"
              />
              <span className={`ep-status ${entrepreneur.isOnline ? 'online' : 'offline'}`}></span>
            </div>

            <div className="ep-header-info">
              <h1>{entrepreneur.name}</h1>
              <p className="ep-subtitle">
                <Building2 size={15} /> Founder at {entrepreneur.startupName}
              </p>
              <div className="ep-badges">
                <span className="ep-badge blue">{entrepreneur.industry}</span>
                <span className="ep-badge gray"><MapPin size={12} /> {entrepreneur.location}</span>
                <span className="ep-badge accent"><Calendar size={12} /> Founded {entrepreneur.foundedYear}</span>
                <span className="ep-badge secondary"><Users size={12} /> {entrepreneur.teamSize} members</span>
              </div>
            </div>
          </div>

          <div className="ep-header-actions">
            {!isCurrentUser && (
              <>
                <Link to={`/chat/${entrepreneur.id}`}>
                  <button className="btn-outline"><MessageCircle size={16} /> Message</button>
                </Link>
                {isInvestor && (
                  <button
                    className="btn-blue"
                    disabled={requestSent}
                    onClick={handleSendRequest}
                  >
                    <Send size={16} />
                    {requestSent ? 'Request Sent' : 'Request Collaboration'}
                  </button>
                )}
              </>
            )}
            {isCurrentUser && (
              <button className="btn-outline"><UserCircle size={16} /> Edit Profile</button>
            )}
          </div>
        </div>

        {/* ===== MAIN GRID ===== */}
        <div className="ep-grid">

          {/* LEFT SIDE */}
          <div className="ep-left">

            {/* About */}
            <div className="ep-card">
              <div className="ep-card-header"><h2>About</h2></div>
              <div className="ep-card-body">
                <p>{entrepreneur.bio}</p>
              </div>
            </div>

            {/* Startup Overview */}
            <div className="ep-card">
              <div className="ep-card-header"><h2>Startup Overview</h2></div>
              <div className="ep-card-body ep-overview">
                <div>
                  <h3>Problem Statement</h3>
                  <p>{entrepreneur.pitchSummary.split('.')[0]}.</p>
                </div>
                <div>
                  <h3>Solution</h3>
                  <p>{entrepreneur.pitchSummary}</p>
                </div>
                <div>
                  <h3>Market Opportunity</h3>
                  <p>The {entrepreneur.industry} market is experiencing significant growth, with a projected CAGR of 14.5% through 2027.</p>
                </div>
                <div>
                  <h3>Competitive Advantage</h3>
                  <p>Unlike competitors, we combine innovative technology with deep industry expertise for superior outcomes.</p>
                </div>
              </div>
            </div>

            {/* Team */}
            <div className="ep-card">
              <div className="ep-card-header">
                <h2>Team</h2>
                <span>{entrepreneur.teamSize} members</span>
              </div>
              <div className="ep-card-body">
                <div className="ep-team-grid">
                  <div className="ep-team-member">
                    <img src={entrepreneur.avatarUrl} alt={entrepreneur.name} />
                    <div>
                      <h4>{entrepreneur.name}</h4>
                      <p>Founder & CEO</p>
                    </div>
                  </div>
                  <div className="ep-team-member">
                    <img src="https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg" alt="Alex" />
                    <div>
                      <h4>Alex Johnson</h4>
                      <p>CTO</p>
                    </div>
                  </div>
                  <div className="ep-team-member">
                    <img src="https://images.pexels.com/photos/773371/pexels-photo-773371.jpeg" alt="Jessica" />
                    <div>
                      <h4>Jessica Chen</h4>
                      <p>Head of Product</p>
                    </div>
                  </div>
                  {entrepreneur.teamSize > 3 && (
                    <div className="ep-team-more">
                      + {entrepreneur.teamSize - 3} more members
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="ep-right">

            {/* Funding */}
            <div className="ep-card">
              <div className="ep-card-header"><h2>Funding</h2></div>
              <div className="ep-card-body">
                <div className="ep-funding-item">
                  <span>Current Round</span>
                  <strong><DollarSign size={15} /> {entrepreneur.fundingNeeded}</strong>
                </div>
                <div className="ep-funding-item">
                  <span>Valuation</span>
                  <strong>$8M - $12M</strong>
                </div>
                <div className="ep-funding-item">
                  <span>Previous Funding</span>
                  <strong>$750K Seed (2022)</strong>
                </div>
                <div className="ep-funding-timeline">
                  <span>Funding Timeline</span>
                  <div className="ep-timeline-item">
                    <p>Pre-seed</p><span className="badge-green">Completed</span>
                  </div>
                  <div className="ep-timeline-item">
                    <p>Seed</p><span className="badge-green">Completed</span>
                  </div>
                  <div className="ep-timeline-item">
                    <p>Series A</p><span className="badge-yellow">In Progress</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="ep-card">
              <div className="ep-card-header"><h2>Documents</h2></div>
              <div className="ep-card-body">
                {['Pitch Deck', 'Business Plan', 'Financial Projections'].map((doc, i) => (
                  <div className="ep-doc-item" key={i}>
                    <div className="ep-doc-icon"><FileText size={17} /></div>
                    <div className="ep-doc-info">
                      <h4>{doc}</h4>
                      <p>Updated {i === 0 ? '2 months' : i === 1 ? '1 month' : '2 weeks'} ago</p>
                    </div>
                    <button className="btn-outline-sm">View</button>
                  </div>
                ))}

                {!isCurrentUser && isInvestor && (
                  <div className="ep-doc-footer">
                    <p>Request access to detailed documents by sending a collaboration request.</p>
                    <button
                      className="btn-blue w-full"
                      disabled={requestSent}
                      onClick={handleSendRequest}
                    >
                      {requestSent ? 'Request Sent' : 'Request Collaboration'}
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default EntrepreneurProfile;
