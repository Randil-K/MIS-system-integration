import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Trash2 } from 'lucide-react';
import api from '../api';
import NewSale from '../components/NewSale';
import './OrdersManagement.css';

export default function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleSaleAdded = (newOrder) => {
    setOrders([newOrder, ...orders]);
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await api.delete(`/orders/${id}`);
        setOrders(orders.filter(o => o.id !== id));
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
  };

  return (
    <div className="main-content">
      <div className="header">
        <h1>Orders</h1>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> New Order
        </button>
      </div>

      <NewSale 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSaleAdded={handleSaleAdded} 
      />

      <div className="table-container">
        <div className="table-header">
          <div className="search-bar">
            <Search size={16} className="search-icon" />
            <input type="text" placeholder="Search orders..." />
          </div>
          <div className="flex gap-2">
            <button className="btn btn-secondary"><Filter size={16} /> Filter</button>
          </div>
        </div>
        {loading ? (
          <p>Loading orders...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="col-order-id">{order.id}</td>
                  <td>{order.customer ? order.customer.name : 'Unknown'}</td>
                  <td className="col-date">{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}</td>
                  <td className="col-amount">{order.totalAmount}</td>
                  <td>
                    <span className={`badge ${order.status === 'Completed' ? 'badge-success' : order.status === 'Processing' ? 'badge-warning' : 'badge-danger'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn-icon text-danger" onClick={() => handleDelete(order.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
