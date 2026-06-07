import { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Check, X, Trash2 } from 'lucide-react';
import { Sidebar } from '../../Components/Sidebar';
import { useAuth } from '../../store/auth';
import './MeetingsPage.css';

const MeetingsPage = () => {
  const { user, token } = useAuth();
  const role = user?.role || 'entrepreneur';

  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scheduledWith: '',
    date: '',
    time: '',
    duration: 30,
  });

  // ✅ Fetch meetings
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const res = await fetch('http://localhost:1000/api/meetings/my-meetings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setMeetings(data.meetings || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchMeetings();
  }, [token]);

  // ✅ Schedule meeting
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:1000/api/meetings/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setMeetings(prev => [data.meeting, ...prev]);
        setShowForm(false);
        setFormData({ title: '', description: '', scheduledWith: '', date: '', time: '', duration: 30 });
        alert('Meeting scheduled successfully!');
      } else {
        alert(data.msg || 'Failed to schedule meeting');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Accept meeting
  const handleAccept = async (id) => {
    try {
      const res = await fetch(`http://localhost:1000/api/meetings/accept/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMeetings(prev => prev.map(m => m._id === id ? { ...m, status: 'accepted' } : m));
      }
    } catch (err) { console.error(err); }
  };

  // ✅ Reject meeting
  const handleReject = async (id) => {
    try {
      const res = await fetch(`http://localhost:1000/api/meetings/reject/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMeetings(prev => prev.map(m => m._id === id ? { ...m, status: 'rejected' } : m));
      }
    } catch (err) { console.error(err); }
  };

  // ✅ Cancel meeting
  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this meeting?')) return;
    try {
      const res = await fetch(`http://localhost:1000/api/meetings/cancel/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMeetings(prev => prev.map(m => m._id === id ? { ...m, status: 'cancelled' } : m));
      }
    } catch (err) { console.error(err); }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'meet-status-yellow';
      case 'accepted': return 'meet-status-green';
      case 'rejected': return 'meet-status-red';
      case 'cancelled': return 'meet-status-gray';
      default: return '';
    }
  };

  const upcomingCount = meetings.filter(m => m.status === 'accepted').length;
  const pendingCount = meetings.filter(m => m.status === 'pending').length;

  return (
    <div className="dashboard-layout">
      <Sidebar role={role} />
      <main className="dashboard-main">

        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>Meetings</h1>
            <p>Schedule and manage your meetings</p>
          </div>
          <button className="dashboard-btn" onClick={() => setShowForm(!showForm)}>
            <Plus size={18} /> Schedule Meeting
          </button>
        </div>

        {/* Stats */}
        <div className="stats-grid stats-grid-3">
          <div className="stat-card">
            <div className="stat-icon blue"><Calendar size={20} /></div>
            <div>
              <p className="stat-label">Total Meetings</p>
              <h2 className="stat-value">{meetings.length}</h2>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green"><Check size={20} /></div>
            <div>
              <p className="stat-label">Upcoming</p>
              <h2 className="stat-value">{upcomingCount}</h2>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange"><Clock size={20} /></div>
            <div>
              <p className="stat-label">Pending</p>
              <h2 className="stat-value">{pendingCount}</h2>
            </div>
          </div>
        </div>

        {/* Schedule Form */}
        {showForm && (
          <div className="meet-form-card">
            <h2>Schedule New Meeting</h2>
            <form onSubmit={handleSubmit} className="meet-form">
              <div className="meet-form-grid">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    placeholder="Meeting title"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>With (User ID)</label>
                  <input
                    type="text"
                    placeholder="Enter user ID"
                    value={formData.scheduledWith}
                    onChange={e => setFormData({ ...formData, scheduledWith: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={e => setFormData({ ...formData, time: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Duration (minutes)</label>
                  <select
                    value={formData.duration}
                    onChange={e => setFormData({ ...formData, duration: e.target.value })}
                  >
                    <option value={15}>15 min</option>
                    <option value={30}>30 min</option>
                    <option value={45}>45 min</option>
                    <option value={60}>60 min</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    placeholder="Meeting description"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>
              <div className="meet-form-actions">
                <button type="submit" className="dashboard-btn">Schedule</button>
                <button type="button" className="meet-cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Meetings List */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>All Meetings</h2>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : meetings.length === 0 ? (
            <div className="empty-state">
              <Calendar size={40} color="#94a3b8" />
              <p>No meetings yet</p>
              <span>Schedule a meeting to get started</span>
            </div>
          ) : (
            <div className="meet-list">
              {meetings.map(meeting => (
                <div key={meeting._id} className="meet-card">
                  <div className="meet-card-left">
                    <div className="meet-date-box">
                      <span className="meet-day">
                        {new Date(meeting.date).getDate()}
                      </span>
                      <span className="meet-month">
                        {new Date(meeting.date).toLocaleString('default', { month: 'short' })}
                      </span>
                    </div>
                    <div className="meet-info">
                      <h3>{meeting.title}</h3>
                      <p>{meeting.description}</p>
                      <div className="meet-meta">
                        <span><Clock size={13} /> {meeting.time}</span>
                        <span><Calendar size={13} /> {meeting.duration} min</span>
                        <span>
                          With: {meeting.scheduledBy?._id === user?._id
                            ? meeting.scheduledWith?.username
                            : meeting.scheduledBy?.username}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="meet-card-right">
                    <span className={`meet-status ${getStatusClass(meeting.status)}`}>
                      {meeting.status}
                    </span>
                    <div className="meet-actions">
                      {meeting.status === 'pending' && meeting.scheduledWith?._id === user?._id && (
                        <>
                          <button className="meet-btn accept" onClick={() => handleAccept(meeting._id)}>
                            <Check size={16} /> Accept
                          </button>
                          <button className="meet-btn reject" onClick={() => handleReject(meeting._id)}>
                            <X size={16} /> Reject
                          </button>
                        </>
                      )}
                      {meeting.status !== 'cancelled' && (
                        <button className="meet-btn cancel" onClick={() => handleCancel(meeting._id)}>
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MeetingsPage;