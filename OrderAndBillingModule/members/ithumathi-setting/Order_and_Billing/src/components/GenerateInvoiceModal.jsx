import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../api';
import './GenerateInvoiceModal.css';

export default function GenerateInvoiceModal({ isOpen, onClose, onInvoiceGenerated }) {
  const [orders, setOrders] = useState([]);
  const [invoice, setInvoice] = useState({ orderId: '', amount: '', issueDate: '', dueDate: '', status: 'Pending' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchOrders();
      setInvoice({ 
        orderId: '', 
        amount: '', 
        issueDate: new Date().toISOString().split('T')[0], 
        dueDate: '', 
        status: 'Pending' 
      });
    }
  }, [isOpen]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleOrderChange = (orderId) => {
    const selectedOrder = orders.find(o => o.id === parseInt(orderId));
    if (selectedOrder) {
      setInvoice({
        ...invoice,
        orderId: orderId,
        amount: selectedOrder.totalAmount
      });
    } else {
      setInvoice({ ...invoice, orderId: '', amount: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const invoiceData = {
        order: { id: parseInt(invoice.orderId) },
        amount: parseFloat(invoice.amount),
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate,
        status: invoice.status
      };
      
      const response = await api.post('/invoices', invoiceData);
      onInvoiceGenerated(response.data);
      onClose();
    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('Failed to generate invoice. Order might already have an invoice or data is invalid.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="invoice-modal-overlay">
      <div className="invoice-modal-content fade-in">
        <div className="modal-header">
          <h2>Generate Invoice</h2>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="invoice-form">
          <div className="form-group">
            <label>Select Order</label>
            <select required value={invoice.orderId} onChange={(e) => handleOrderChange(e.target.value)}>
              <option value="">-- Choose an Order --</option>
              {orders.map(order => (
                <option key={order.id} value={order.id}>
                  Order #{order.id} - {order.customer ? order.customer.name : 'Unknown'}
                </option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Amount (LKR)</label>
              <input type="number" step="0.01" required value={invoice.amount} onChange={(e) => setInvoice({...invoice, amount: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={invoice.status} onChange={(e) => setInvoice({...invoice, status: e.target.value})}>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Issue Date</label>
              <input type="date" required value={invoice.issueDate} onChange={(e) => setInvoice({...invoice, issueDate: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input type="date" required value={invoice.dueDate} onChange={(e) => setInvoice({...invoice, dueDate: e.target.value})} />
            </div>
          </div>
          
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Generating...' : 'Generate Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
