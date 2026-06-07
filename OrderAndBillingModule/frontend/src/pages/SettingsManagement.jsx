import './SettingsManagement.css';

export default function SettingsManagement() {
  return (
    <div className="main-content">
      <div className="header">
        <h1>Settings</h1>
        <button className="btn btn-primary">
          Save Changes
        </button>
      </div>
      
      <div className="settings-grid">
        <div className="settings-card">
          <h2>User Profile</h2>
          <div className="profile-section">
            <div className="avatar-container">
              <div className="avatar">A</div>
              <button className="btn btn-secondary text-sm">Change Avatar</button>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" defaultValue="Admin User" className="form-input" />
              </div>
              <div className="form-group">
                <label>Role</label>
                <input type="text" defaultValue="Administrator" disabled className="form-input" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" defaultValue="admin@omakcomputers.lk" className="form-input" />
              </div>
            </div>
          </div>
        </div>

        <div className="settings-card">
          <h2>Store Settings</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Store Name</label>
              <input type="text" defaultValue="Omak Computers" className="form-input" />
            </div>
            <div className="form-group">
              <label>Contact Email</label>
              <input type="email" defaultValue="support@omakcomputers.lk" className="form-input" />
            </div>
            <div className="form-group">
              <label>Currency</label>
              <select className="form-input">
                <option value="LKR">LKR - Sri Lankan Rupee</option>
                <option value="USD">USD - US Dollar</option>
              </select>
            </div>
            <div className="form-group">
              <label>Tax Rate (%)</label>
              <input type="number" defaultValue="15" className="form-input" />
            </div>
          </div>
        </div>

        <div className="settings-card">
          <h2>User Preferences</h2>
          <div className="preferences-list">
            <label className="checkbox-label">
              <input type="checkbox" defaultChecked />
              Enable Email Notifications for New Orders
            </label>
            <label className="checkbox-label">
              <input type="checkbox" defaultChecked />
              Show Low Stock Alerts on Dashboard
            </label>
            <label className="checkbox-label">
              <input type="checkbox" />
              Enable Two-Factor Authentication
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
