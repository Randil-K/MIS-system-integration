import { useState } from 'react';
import './index.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import ProductManagement from './pages/ProductManagement';
import OrdersManagement from './pages/OrdersManagement';
import CustomersManagement from './pages/CustomersManagement';
import InvoicesManagement from './pages/InvoicesManagement';
import SettingsManagement from './pages/SettingsManagement';

function App() {
  const [activeTab, setActiveTab] = useState('products');

  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'products' && <ProductManagement />}
      {activeTab === 'orders' && <OrdersManagement />}
      {activeTab === 'customers' && <CustomersManagement />}
      {activeTab === 'invoices' && <InvoicesManagement />}
      {activeTab === 'settings' && <SettingsManagement />}
      <Footer />
    </div>
  );
}

export default App;
