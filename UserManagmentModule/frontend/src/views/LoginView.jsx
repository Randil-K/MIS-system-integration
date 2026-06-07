import React, { useState } from 'react';
import {
  AlertTriangle,
  Mail,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';

export default function LoginView({ onLogin, loading, error, setError }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all details.');
      return;
    }
    onLogin(email, password);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      backgroundColor: '#f1f5f9'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%',
        maxWidth: '420px',
        padding: '35px 30px',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            background: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '1.4rem',
            color: 'white',
            margin: '0 auto 12px auto',
          }}>
            U
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '4px', color: 'var(--text-main)' }}>
            Sign In
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>
            Please sign in to access your dashboard
          </p>
        </div>

        {error && (
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
            marginBottom: '20px',
          }}>
            <AlertTriangle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input
                id="login-email"
                type="email"
                className="input-field"
                placeholder="name@system.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                style={{ paddingLeft: '40px' }}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label" htmlFor="login-password">Password</label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={16} style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                style={{ paddingLeft: '40px', paddingRight: '40px' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '12px' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Demo profiles quick links */}
        <div style={{
          marginTop: '25px',
          padding: '14px',
          background: '#f8fafc',
          border: '1px solid var(--border-glass)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.75rem'
        }}>
          <p style={{ fontWeight: '600', color: 'var(--text-main)', marginBottom: '8px' }}>🔑 Demo Credentials:</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', color: 'var(--text-muted)' }}>
            <div>
              <p style={{ color: 'var(--color-danger)', fontWeight: '600' }}>Admin:</p>
              <p>admin@system.com</p>
              <p style={{ fontSize: '0.7rem' }}>Pass: admin123</p>
            </div>
            <div>
              <p style={{ color: 'var(--color-secondary)', fontWeight: '600' }}>Manager:</p>
              <p>manager@system.com</p>
              <p style={{ fontSize: '0.7rem' }}>Pass: manager123</p>
            </div>
            <div>
              <p style={{ color: 'var(--color-warning)', fontWeight: '600' }}>Supplier:</p>
              <p>supplier@system.com</p>
              <p style={{ fontSize: '0.7rem' }}>Pass: supplier123</p>
            </div>
            <div>
              <p style={{ color: 'var(--color-primary)', fontWeight: '600' }}>Warehouse:</p>
              <p>warehouse@system.com</p>
              <p style={{ fontSize: '0.7rem' }}>Pass: warehouse123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
