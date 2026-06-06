import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MessageCircle, Users, Calendar, Building2, MapPin, UserCircle, FileText, DollarSign, Send } from 'lucide-react';
import { useAuth } from '../../store/auth';
import { Sidebar } from '../../Components/Sidebar';
import './EntrepreneurProfile.css';

const EntrepreneurProfile = () => {
  const { id } = useParams();
  const { user: currentUser, token } = useAuth();
  const navigate = useNavigate();
  const role = currentUser?.role || 'entrepreneur';

  const [entrepreneur, setEntrepreneur] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestSent, setRequestSent] = useState(false);

  // ✅ Backend se real user fetch karo
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:1000/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setEntrepreneur(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id, token]);

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar role={role} />
        <main className="dashboard-main">
          <p>Loading...</p>
        </main>
      </div>
    );
  }

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

  const isCurrentUser = currentUser?._id === id;
  const isInvestor = currentUser?.role === 'investor';

  return (
    <div className="dashboard-layout">
      <Sidebar role={role} />
      <main className="dashboard-main">

        {/* PROFILE HEADER */}
        <div className="ep-header-card">
          <div className="ep-header-left">
            <div className="ep-avatar-wrapper">
              <div className="ep-avatar-initials">
                {entrepreneur.username?.charAt(0).toUpperCase()}
              </div>
              <span className="ep-status online"></span>
            </div>

            <div className="ep-header-info">
              <h1>{entrepreneur.username}</h1>
              <p className="ep-subtitle">
                <Building2 size={15} /> Entrepreneur
              </p>
              <div className="ep-badges">
                <span className="ep-badge blue">{entrepreneur.email}</span>
                <span className="ep-badge gray"><MapPin size={12} /> Location N/A</span>
              </div>
            </div>
          </div>

          <div className="ep-header-actions">
            {isCurrentUser && (
              <button className="btn-outline"><UserCircle size={16} /> Edit Profile</button>
            )}
            {!isCurrentUser && isInvestor && (
              <button
                className="btn-blue"
                disabled={requestSent}
                onClick={() => setRequestSent(true)}
              >
                <Send size={16} />
                {requestSent ? 'Request Sent' : 'Request Collaboration'}
              </button>
            )}
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="ep-grid">
          <div className="ep-left">
            <div className="ep-card">
              <div className="ep-card-header"><h2>About</h2></div>
              <div className="ep-card-body">
                <p>Name: {entrepreneur.username}</p>
                <p>Email: {entrepreneur.email}</p>
                <p>Phone: {entrepreneur.phone || 'N/A'}</p>
                <p>Age: {entrepreneur.age || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="ep-right">
            <div className="ep-card">
              <div className="ep-card-header"><h2>Documents</h2></div>
              <div className="ep-card-body">
                {['Pitch Deck', 'Business Plan', 'Financial Projections'].map((doc, i) => (
                  <div className="ep-doc-item" key={i}>
                    <div className="ep-doc-icon"><FileText size={17} /></div>
                    <div className="ep-doc-info">
                      <h4>{doc}</h4>
                      <p>Not uploaded yet</p>
                    </div>
                    <button className="btn-outline-sm">View</button>
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

export default EntrepreneurProfile;