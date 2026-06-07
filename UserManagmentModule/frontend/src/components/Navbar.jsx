import React from 'react';
import { Calendar } from 'lucide-react';

export default function Navbar({ view, user }) {
  const getPageTitle = () => {
    switch (view) {
      case 'dashboard':
        return 'Dashboard Overview';
      case 'users':
        return 'User Directory';
      case 'profile':
        return 'Profile Settings';
      default:
        return 'Console';
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="glass-panel animate-fade-in" style={{
      margin: '20px 20px 0 20px',
      padding: '16px 25px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '70px',
    }}>
      <div>
        <h1 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)' }}>
          {getPageTitle()}
        </h1>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {getGreeting()}, {user.name.split(' ')[0]}!
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          background: '#f8fafc',
          padding: '6px 12px',
          borderRadius: '20px',
          border: '1px solid var(--border-glass)'
        }}>
          <Calendar size={13} style={{ color: 'var(--color-primary)' }} />
          <span>{formattedDate}</span>
        </div>
      </div>
    </header>
  );
}
