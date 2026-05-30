import { useState } from 'react';
import { User, Lock, Bell, Globe, Palette, CreditCard } from 'lucide-react';
import { Sidebar } from '../../Components/Sidebar';
import { useAuth } from '../../store/auth';
import './SettingsPage.css';

const SettingsPage = () => {
  const { user } = useAuth();
  const role = user?.role || 'entrepreneur';

  const [activeTab, setActiveTab] = useState('profile');

  const [profileData, setProfileData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    location: "",
    bio: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileInput = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handlePasswordInput = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    alert("Profile updated successfully!");
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Password updated successfully!");
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
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

        {/* Header */}
        <div className="settings-header">
          <h1>Settings</h1>
          <p>Manage your account preferences and settings</p>
        </div>

        <div className="settings-layout">

          {/* Left Nav */}
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

          {/* Right Content */}
          <div className="settings-content">

            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div className="settings-section">
                <h2>Profile Settings</h2>

                {/* Avatar */}
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
                        readOnly
                        className="input-readonly"
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileInput}
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

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="settings-section">
                <h2>Security Settings</h2>

                {/* 2FA */}
                <div className="security-row">
                  <div>
                    <h3>Two-Factor Authentication</h3>
                    <p>Add an extra layer of security to your account</p>
                    <span className="badge-error">Not Enabled</span>
                  </div>
                  <button className="settings-btn outline">Enable</button>
                </div>

                <div className="divider" />

                {/* Change Password */}
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