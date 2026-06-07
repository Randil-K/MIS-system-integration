import { LayoutDashboard, Package, ShoppingCart, Users, FileText, Settings, Cpu, Search } from 'lucide-react';
import './Navbar.css';

export default function Navbar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

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
      <div className="flex items-center gap-2">
        <button className="btn-icon">
          <Search size={20} />
        </button>
        <div style={{width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', marginLeft: '0.5rem', cursor: 'pointer', border: 'var(--glass-border)'}}>
          A
        </div>
      </div>
    </header>
  );
}
