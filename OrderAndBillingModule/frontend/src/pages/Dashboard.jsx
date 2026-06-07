import { useState, useEffect } from 'react';
import { FileText, Plus, TrendingUp, ShoppingCart, AlertCircle, PackageSearch } from 'lucide-react';
import api from '../api';
import NewSale from '../components/NewSale';
import { exportOrdersToCSV } from '../utils/exportUtils';
import './Dashboard.css';

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleSaleAdded = (newOrder) => {
    setOrders([newOrder, ...orders]);
    setIsModalOpen(false);
  };

  const handleExportReport = () => {
    exportOrdersToCSV(orders);
  };

  // Calculate some simple metrics based on orders
  const todayRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const totalOrders = orders.length;

  return (
    <div className="main-content">
      <div className="header">
        <h1>Store Overview</h1>
        <div className="flex gap-2">
          <button className="btn btn-secondary" onClick={handleExportReport}>
            <FileText size={16} /> Export Report
          </button>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> New Sale
          </button>
        </div>
      </div>

      <NewSale 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSaleAdded={handleSaleAdded} 
      />

      <div className="card-grid">
        <div className="card">
          <div className="card-header">
            <span>Total Revenue</span>
            <TrendingUp size={16} className="text-success" />
          </div>
          <div className="card-value">LKR {todayRevenue.toLocaleString()}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '0.5rem' }}>
            Based on all orders
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <span>Total Orders</span>
            <ShoppingCart size={16} style={{ color: 'var(--accent-cyan)' }} />
          </div>
          <div className="card-value">{totalOrders}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '0.5rem' }}>
            Total transactions
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <span>Pending Fulfillments</span>
            <AlertCircle size={16} className="text-warning" />
          </div>
          <div className="card-value">{orders.filter(o => o.status !== 'Completed').length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Orders requiring action
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <span>Inventory Alerts</span>
            <PackageSearch size={16} className="text-danger" />
          </div>
          <div className="card-value">0</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '0.5rem' }}>
            Items low or out of stock
          </div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2>Recent Transactions</h2>
          <button className="btn btn-secondary text-sm">View All</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 5).map((order) => (
              <tr key={order.id}>
                <td style={{ fontWeight: 500, color: 'var(--accent-cyan)' }}>{order.id}</td>
                <td>{order.customer ? order.customer.name : 'Unknown'}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}</td>
                <td style={{ fontWeight: 600 }}>{order.totalAmount}</td>
                <td>
                  <span className={`badge ${order.status === 'Completed' ? 'badge-success' : order.status === 'Processing' ? 'badge-warning' : 'badge-danger'}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
