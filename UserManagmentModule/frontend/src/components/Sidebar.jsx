import React from 'react';
import {
  LayoutDashboard,
  Users,
  User as UserIcon,
  LogOut,
  ExternalLink,
  ShoppingCart,
  Package,
  Truck
} from 'lucide-react';

export default function Sidebar({ view, setView, user, onLogout }) {
  const links = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'MANAGER', 'SUPPLIER', 'WAREHOUSE_STAFF'] },
    { id: 'users', label: 'Users Control', icon: Users, roles: ['ADMIN'] },
    { id: 'profile', label: 'Profile Settings', icon: UserIcon, roles: ['ADMIN', 'MANAGER', 'SUPPLIER', 'WAREHOUSE_STAFF'] },
  ];

  const authorizedLinks = links.filter(link => link.roles.includes(user.role));

  return (
    <aside className="sidebar-container animate-fade-in" style={{
      width: '260px',
      minHeight: 'calc(100vh - 40px)',
      margin: '20px 0 20px 20px',
      padding: '25px 15px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      border: '1px solid var(--border-glass)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-premium)'
    }}>
      <div>
        {/* Brand Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '35px',
          padding: '0 10px'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            color: 'white',
          }}>
            U
          </div>
          <span style={{
            fontWeight: '800',
            fontSize: '1.1rem',
            color: 'var(--text-main)',
          }}>
            Console
          </span>
        </div>

        {/* Navigation links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {authorizedLinks.map((link) => {
            const Icon = link.icon;
            const isActive = view === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setView(link.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  color: isActive ? 'var(--color-primary)' : 'var(--text-muted)',
                  background: isActive ? '#f0f2ff' : 'transparent',
                  border: 'none',
                  outline: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  transition: 'var(--transition-smooth)',
                }}
              >
                <Icon size={18} />
                <span>{link.label}</span>
              </button>
            );
          })}

          <div style={{ height: '1px', background: 'var(--border-glass)', margin: '15px 0' }} />
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600', paddingLeft: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Modules</p>

          {(user.role === 'ADMIN' || user.role === 'MANAGER') && (
            <a href="/orders/" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '10px 16px', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '600', fontSize: '0.85rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <ShoppingCart size={16} />
                <span>Order & Billing</span>
              </div>
              <ExternalLink size={14} />
            </a>
          )}

          {(user.role === 'ADMIN' || user.role === 'SUPPLIER') && (
            <a href="/inventory/" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '10px 16px', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '600', fontSize: '0.85rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Package size={16} />
                <span>Inventory</span>
              </div>
              <ExternalLink size={14} />
            </a>
          )}

          {(user.role === 'ADMIN' || user.role === 'WAREHOUSE_STAFF') && (
            <a href="/logistics/" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '10px 16px', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '600', fontSize: '0.85rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Truck size={16} />
                <span>Logistics</span>
              </div>
              <ExternalLink size={14} />
            </a>
          )}
        </nav>
      </div>

      {/* User Session card info */}
      <div>
        <div style={{
          padding: '12px 10px',
          borderTop: '1px solid var(--border-glass)',
          marginTop: '20px',
          marginBottom: '15px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            fontWeight: 'bold',
            color: 'white'
          }}>
            {user.name.charAt(0)}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{
              fontSize: '0.85rem',
              fontWeight: '600',
              color: 'var(--text-main)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {user.name}
            </p>
            <span className={`badge badge-${
              user.role === 'ADMIN' ? 'admin' :
              user.role === 'MANAGER' ? 'manager' :
              user.role === 'SUPPLIER' ? 'supplier' : 'staff'
            }`} style={{ fontSize: '0.6rem', padding: '2px 6px', marginTop: '2px' }}>
              {user.role.replace('_', ' ')}
            </span>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="btn btn-secondary"
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px' }}
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
