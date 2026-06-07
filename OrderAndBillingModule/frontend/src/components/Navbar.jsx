import { LayoutDashboard, Package, ShoppingCart, Users, FileText, Settings, Cpu, Search } from 'lucide-react';
import './Navbar.css';

export default function Navbar({ activeTab, setActiveTab, user }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const getUserInitial = () => {
    if (user && user.fullName) return user.fullName.charAt(0).toUpperCase();
    if (user && user.username) return user.username.charAt(0).toUpperCase();
    return 'A';
  };

  return (
    <header className="navbar">
      <div className="navbar-logo">
        <div className="logo-icon">
          <Cpu size={24} />
        </div>
        Omak Computers
      </div>
      <nav>
        <ul className="nav-links">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isClickable = true;
            return (
               <li key={item.id}>
                <a 
                  className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => {
                    if (isClickable) setActiveTab(item.id);
                  }}
                  style={{ cursor: isClickable ? 'pointer' : 'default' }}
                >
                  <Icon size={18} />
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="navbar-user-section">
        <div className="navbar-user-info">
          <div className="navbar-avatar">
            {getUserInitial()}
          </div>
          <div className="navbar-user-details">
            <span className="navbar-user-name">{user ? user.fullName : 'Administrator'}</span>
            <span className="navbar-user-role">{user ? user.role : ''}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
