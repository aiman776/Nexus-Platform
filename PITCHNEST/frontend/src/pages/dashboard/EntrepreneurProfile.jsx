import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageCircle, Building2, MapPin, UserCircle, FileText, Send } from 'lucide-react';
import { useAuth } from '../../store/auth';
import { Sidebar } from '../../Components/Sidebar';
import './EntrepreneurProfile.css';

const EntrepreneurProfile = () => {
  const { id } = useParams();
  const { user: currentUser, token } = useAuth();
  const navigate = useNavigate();

  const [entrepreneur, setEntrepreneur] = useState(null);
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const myId = currentUser?._id || currentUser?.id;
        const isMine = !id || id === myId;

        // ✅ Apna profile ya dusre ka
        const url = isMine
          ? `http://localhost:1000/api/profile`
          : `http://localhost:1000/api/auth/user/${id}`;

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setEntrepreneur(data.user || data);

        // ✅ Startup fetch karo
        const startupRes = await fetch(`http://localhost:1000/api/startups`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const startupData = await startupRes.json();
        if (startupRes.ok) {
          const found = startupData.startups?.find(
            s => s.user?._id === id || s.user === id ||
                 s.user?._id === myId || s.user === myId
          );
          setStartup(found || null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchProfile();
  }, [id, token, currentUser]);

  // ✅ Message handler
  const handleMessage = async () => {
    try {
      const res = await fetch('http://localhost:1000/api/messages/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ receiverId: entrepreneur._id || id }),
      });
      if (res.ok) navigate('/messages');
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Collaboration request
  const handleSendRequest = async () => {
    try {
      const res = await fetch('http://localhost:1000/api/collaborations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: id,
          message: `I am interested in your startup!`,
        }),
      });
      if (res.ok) setRequestSent(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main"><p>Loading...</p></main>
    </div>
  );

  if (!entrepreneur) return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div className="not-found">
          <h2>Entrepreneur not found</h2>
          <button className="btn-blue" onClick={() => navigate(-1)}>← Go Back</button>
        </div>
      </main>
    </div>
  );

  const myId = currentUser?._id || currentUser?.id;
  const isCurrentUser = entrepreneur._id === myId || !id || id === myId;
  const isInvestor = currentUser?.role === 'investor';

  return (
    <div className="dashboard-layout">
      <Sidebar />
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
              <p className="ep-subtitle"><Building2 size={15} /> Entrepreneur</p>
              <div className="ep-badges">
                <span className="ep-badge blue">{entrepreneur.email}</span>
                <span className="ep-badge gray">
                  <MapPin size={12} /> {entrepreneur.location || 'Location N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="ep-header-actions">
            {isCurrentUser && (
              <button className="btn-outline" onClick={() => navigate('/settings')}>
                <UserCircle size={16} /> Edit Profile
              </button>
            )}
            {!isCurrentUser && (
              <button className="btn-outline" onClick={handleMessage}>
                <MessageCircle size={16} /> Message
              </button>
            )}
            {!isCurrentUser && isInvestor && (
              <button className="btn-blue" disabled={requestSent} onClick={handleSendRequest}>
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
                <p>Bio: {entrepreneur.bio || 'N/A'}</p>
                <p>Location: {entrepreneur.location || 'N/A'}</p>
                <p>Website: {entrepreneur.website || 'N/A'}</p>
                <p>LinkedIn: {entrepreneur.linkedin || 'N/A'}</p>
              </div>
            </div>

            {startup && (
              <div className="ep-card">
                <div className="ep-card-header"><h2>Startup</h2></div>
                <div className="ep-card-body">
                  <p>Name: {startup.startupName}</p>
                  <p>Industry: {startup.industry}</p>
                  <p>Stage: {startup.stage}</p>
                  <p>Funding: {startup.fundingNeeded}</p>
                  <p>Location: {startup.location}</p>
                  <p>Pitch: {startup.pitchSummary}</p>
                </div>
              </div>
            )}

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