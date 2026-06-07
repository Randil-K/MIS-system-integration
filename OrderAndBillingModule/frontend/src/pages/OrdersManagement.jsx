import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Trash2, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../api';
import NewSale from '../components/NewSale';
import './OrdersManagement.css';

export default function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);

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

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
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
          <p style={{padding: '2rem', textAlign: 'center'}}>Loading orders...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <>
                  <tr key={order.id}>
                    <td className="col-order-id">{order.id}</td>
                    <td>{order.customer ? order.customer.name : 'Unknown'}</td>
                    <td>
                      <span className="badge badge-info">
                        {order.items ? order.items.length : 0} item(s)
                      </span>
                    </td>
                    <td className="col-date">{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}</td>
                    <td className="col-amount">LKR {order.totalAmount ? parseFloat(order.totalAmount).toFixed(2) : '0.00'}</td>
                    <td>
                      <span className={`badge ${order.status === 'Completed' ? 'badge-success' : order.status === 'Processing' ? 'badge-warning' : 'badge-danger'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        {order.items && order.items.length > 0 && (
                          <button className="btn-icon" onClick={() => toggleExpand(order.id)} title="View Items">
                            {expandedOrder === order.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        )}
                        <button className="btn-icon text-danger" onClick={() => handleDelete(order.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedOrder === order.id && order.items && (
                    <tr key={`${order.id}-items`} className="order-items-row">
                      <td colSpan="7">
                        <div className="order-items-detail">
                          <table className="items-detail-table">
                            <thead>
                              <tr>
                                <th>Product</th>
                                <th>Unit Price</th>
                                <th>Quantity</th>
                                <th>Subtotal</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.items.map((item, idx) => (
                                <tr key={idx}>
                                  <td>{item.product ? item.product.name : 'Unknown'}</td>
                                  <td>LKR {item.unitPrice ? parseFloat(item.unitPrice).toFixed(2) : '0.00'}</td>
                                  <td>{item.quantity}</td>
                                  <td className="item-subtotal-cell">LKR {item.subtotal ? parseFloat(item.subtotal).toFixed(2) : '0.00'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
