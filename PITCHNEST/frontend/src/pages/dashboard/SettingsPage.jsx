import { useState, useEffect } from 'react';
import { User, Lock, Bell, Globe, Palette, CreditCard } from 'lucide-react';
import { Sidebar } from '../../Components/Sidebar';
import { useAuth } from '../../store/auth';
import './SettingsPage.css';

const SettingsPage = () => {
  const { user, token, storeTokenInLS } = useAuth();
  const role = user?.role || 'entrepreneur';

  const [activeTab, setActiveTab] = useState('profile');

  const [profileData, setProfileData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    location: user?.location || "",
    bio: user?.bio || "",
    website: user?.website || "",
    linkedin: user?.linkedin || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // ✅ User data load hone pe update karo
  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || "",
        email: user.email || "",
        location: user.location || "",
        bio: user.bio || "",
        website: user.website || "",
        linkedin: user.linkedin || "",
      });
    }
  }, [user]);

  const handleProfileInput = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handlePasswordInput = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  // ✅ Profile update — backend se connect
  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:1000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: profileData.username,
          location: profileData.location,
          bio: profileData.bio,
          website: profileData.website,
          linkedin: profileData.linkedin,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Profile updated successfully!');
      } else {
        alert(data.message || 'Update failed');
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  // ✅ Password update — backend se connect
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    try {
      const res = await fetch('http://localhost:1000/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Password updated successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        alert(data.message || 'Password update failed');
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  const navItems = [
    { id: 'profile', icon: <User size={18} />, label: 'Profile' },
    { id: 'security', icon: <Lock size={18} />, label: 'Security' },
    { id: 'notifications', icon: <Bell size={18} />, label: 'Notifications' },
    { id: 'language', icon: <Globe size={18} />, label: 'Language' },
    { id: 'appearance', icon: <Palette size={18} />, label: 'Appearance' },
    { id: 'billing', icon: <CreditCard size={18} />, label: 'Billing' },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar role={role} />
      <main className="dashboard-main">

        <div className="settings-header">
          <h1>Settings</h1>
          <p>Manage your account preferences and settings</p>
        </div>

        <div className="settings-layout">

          <div className="settings-nav-card">
            <nav>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  className={`settings-nav-btn ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="settings-content">

            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div className="settings-section">
                <h2>Profile Settings</h2>

                <div className="avatar-row">
                  <div className="avatar-big">
                    {user?.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <button className="settings-btn outline">Change Photo</button>
                    <p className="avatar-hint">JPG, GIF or PNG. Max size of 800K</p>
                  </div>
                </div>

                <form onSubmit={handleProfileSave}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        name="username"
                        value={profileData.username}
                        onChange={handleProfileInput}
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        readOnly
                        className="input-readonly"
                      />
                    </div>
                    <div className="form-group">
                      <label>Role</label>
                      <input
                        type="text"
                        value={role}
                        disabled
                        className="input-readonly"
                      />
                    </div>
                    <div className="form-group">
                      <label>Location</label>
                      <input
                        type="text"
                        name="location"
                        value={profileData.location}
                        onChange={handleProfileInput}
                        placeholder="Your city, country"
                      />
                    </div>
                    <div className="form-group">
                      <label>Website</label>
                      <input
                        type="text"
                        name="website"
                        value={profileData.website}
                        onChange={handleProfileInput}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                    <div className="form-group">
                      <label>LinkedIn</label>
                      <input
                        type="text"
                        name="linkedin"
                        value={profileData.linkedin}
                        onChange={handleProfileInput}
                        placeholder="linkedin.com/in/username"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Bio</label>
                    <textarea
                      name="bio"
                      value={profileData.bio}
                      onChange={handleProfileInput}
                      rows={4}
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="form-actions">
                    <button type="button" className="settings-btn outline">Cancel</button>
                    <button type="submit" className="settings-btn primary">Save Changes</button>
                  </div>
                </form>
              </div>
            )}

            {/* Security */}
            {activeTab === 'security' && (
              <div className="settings-section">
                <h2>Security Settings</h2>
                <div className="security-row">
                  <div>
                    <h3>Two-Factor Authentication</h3>
                    <p>Add an extra layer of security to your account</p>
                    <span className="badge-error">Not Enabled</span>
                  </div>
                  <button className="settings-btn outline">Enable</button>
                </div>
                <div className="divider" />
                <h3>Change Password</h3>
                <form onSubmit={handlePasswordUpdate}>
                  <div className="form-group">
                    <label>Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordInput}
                      placeholder="Enter current password"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordInput}
                      placeholder="Enter new password"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordInput}
                      placeholder="Confirm new password"
                      required
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="settings-btn primary">Update Password</button>
                  </div>
                </form>
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div className="settings-section">
                <h2>Notification Preferences</h2>
                <div className="notification-list">
                  {[
                    { label: 'New connection requests', desc: 'Get notified when someone wants to connect' },
                    { label: 'Messages', desc: 'Get notified when you receive a new message' },
                    { label: 'Collaboration requests', desc: 'Get notified about new collaboration requests' },
                    { label: 'Platform updates', desc: 'Get notified about new features and updates' },
                  ].map((item, i) => (
                    <div className="notification-item" key={i}>
                      <div>
                        <p className="notif-label">{item.label}</p>
                        <p className="notif-desc">{item.desc}</p>
                      </div>
                      <label className="toggle">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider" />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Language */}
            {activeTab === 'language' && (
              <div className="settings-section">
                <h2>Language & Region</h2>
                <div className="form-group">
                  <label>Language</label>
                  <select>
                    <option>English</option>
                    <option>Urdu</option>
                    <option>Arabic</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Timezone</label>
                  <select>
                    <option>UTC+5 (Pakistan)</option>
                    <option>UTC+0 (London)</option>
                    <option>UTC-5 (New York)</option>
                  </select>
                </div>
                <div className="form-actions">
                  <button className="settings-btn primary">Save</button>
                </div>
              </div>
            )}

            {/* Appearance */}
            {activeTab === 'appearance' && (
              <div className="settings-section">
                <h2>Appearance</h2>
                <div className="appearance-options">
                  {['Light', 'Dark', 'System'].map((mode) => (
                    <div className={`appearance-card ${mode === 'Light' ? 'active' : ''}`} key={mode}>
                      <div className={`appearance-preview ${mode.toLowerCase()}`} />
                      <p>{mode}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Billing */}
            {activeTab === 'billing' && (
              <div className="settings-section">
                <h2>Billing & Subscription</h2>
                <div className="billing-card">
                  <div>
                    <p className="billing-plan">Free Plan</p>
                    <p className="billing-desc">You are currently on the free plan</p>
                  </div>
                  <button className="settings-btn primary">Upgrade to Pro</button>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;