import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  User as UserIcon,
  KeyRound,
  CheckCircle,
  AlertTriangle,
  History
} from 'lucide-react';

export default function ProfileView({ user, updateSessionProfile }) {
  const [activities, setActivities] = useState([]);
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [contactNumber, setContactNumber] = useState(user?.contactNumber || '');
  
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [profileMsg, setProfileMsg] = useState(null);
  const [profileErr, setProfileErr] = useState(null);
  const [passMsg, setPassMsg] = useState(null);
  const [passErr, setPassErr] = useState(null);
  const [loadingAct, setLoadingAct] = useState(true);

  const fetchMyActivities = async () => {
    try {
      setLoadingAct(true);
      const res = await axios.get('/api/users/my-activities');
      setActivities(res.data);
    } catch (err) {
      console.error('Failed to load activity log settings', err);
    } finally {
      setLoadingAct(false);
    }
  };

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setContactNumber(user.contactNumber || '');
      fetchMyActivities();
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMsg(null);
    setProfileErr(null);

    try {
      const res = await axios.put('/api/users/profile', { name, email, contactNumber });
      updateSessionProfile(res.data);
      setProfileMsg('Personal details updated successfully!');
      fetchMyActivities();
    } catch (err) {
      setProfileErr(err.response?.data?.error || 'Failed to update details.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassMsg(null);
    setPassErr(null);

    if (newPassword !== confirmPassword) {
      setPassErr('New passwords do not match!');
      return;
    }

    try {
      await axios.put('/api/users/change-password', { oldPassword, newPassword });
      setPassMsg('Password updated successfully.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      fetchMyActivities();
    } catch (err) {
      setPassErr(err.response?.data?.error || 'Failed to update password.');
    }
  };

  return (
    <div className="page-container animate-fade-in" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '24px'
    }}>
      {/* Left side Forms */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Profile details update */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
            <UserIcon size={16} style={{ color: 'var(--color-primary)' }} />
            <span>Profile Settings</span>
          </h3>

          {profileMsg && (
            <div style={{
              background: '#dcfce7',
              border: '1px solid #86efac',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-success)',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '15px'
            }}>
              <CheckCircle size={14} />
              <span>{profileMsg}</span>
            </div>
          )}

          {profileErr && (
            <div style={{
              background: '#fee2e2',
              border: '1px solid #fca5a5',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-danger)',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '15px'
            }}>
              <AlertTriangle size={14} />
              <span>{profileErr}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="input-field" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label">Contact Number</label>
              <input type="text" className="input-field" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} required />
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Save Details
            </button>
          </form>
        </div>

        {/* Change password form */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
            <KeyRound size={16} style={{ color: 'var(--color-secondary)' }} />
            <span>Change Password</span>
          </h3>

          {passMsg && (
            <div style={{
              background: '#dcfce7',
              border: '1px solid #86efac',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-success)',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '15px'
            }}>
              <CheckCircle size={14} />
              <span>{passMsg}</span>
            </div>
          )}

          {passErr && (
            <div style={{
              background: '#fee2e2',
              border: '1px solid #fca5a5',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-danger)',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '15px'
            }}>
              <AlertTriangle size={14} />
              <span>{passErr}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input type="password" placeholder="••••••••" className="input-field" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input type="password" placeholder="••••••••" className="input-field" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            </div>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label">Confirm Password</label>
              <input type="password" placeholder="••••••••" className="input-field" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
            
            <button type="submit" className="btn btn-secondary" style={{ width: '100%' }}>
              Change Password
            </button>
          </form>
        </div>
      </div>

      {/* Right side Activity list */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
          <History size={16} style={{ color: 'var(--color-warning)' }} />
          <span>Activity Logs</span>
        </h3>

        {loadingAct ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Loading activity...</p>
        ) : activities.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', padding: '50px 0' }}>
            No activities logged.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '550px', overflowY: 'auto', paddingRight: '4px' }}>
            {activities.map((act) => (
              <div key={act.id} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '12px',
                background: '#f8fafc',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-md)'
              }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--color-secondary)',
                  marginTop: '6px'
                }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: '500' }}>{act.action}</p>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {new Date(act.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
