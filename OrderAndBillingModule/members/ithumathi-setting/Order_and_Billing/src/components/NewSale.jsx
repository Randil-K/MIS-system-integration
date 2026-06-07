import { useState, useEffect } from 'react';
import api from '../api';
import './NewSale.css';

export default function NewSale({ isOpen, onClose, onSaleAdded }) {
  const [customers, setCustomers] = useState([]);
  const [newSale, setNewSale] = useState({ customerId: '', totalAmount: '', status: 'Completed' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCustomers();
    }
  }, [isOpen]);

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/customers');
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleNewSale = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const orderData = {
        customer: { id: newSale.customerId },
        totalAmount: parseFloat(newSale.totalAmount),
        status: newSale.status,
        orderDate: new Date().toISOString()
      };
      const response = await api.post('/orders', orderData);
      onSaleAdded(response.data); // Notify parent component
      setNewSale({ customerId: '', totalAmount: '', status: 'Completed' });
    } catch (error) {
      console.error('Error adding sale:', error);
      alert('Failed to add sale. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="new-sale-modal-overlay">
      <div className="new-sale-modal-content">
        <h2>Add New Sale</h2>
        <form onSubmit={handleNewSale} className="new-sale-form">
          <select required value={newSale.customerId} onChange={(e) => setNewSale({...newSale, customerId: e.target.value})} className="new-sale-input">
            <option value="">Select Customer</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <input type="number" placeholder="Total Amount (LKR)" required value={newSale.totalAmount} onChange={(e) => setNewSale({...newSale, totalAmount: e.target.value})} className="new-sale-input" />
          <select value={newSale.status} onChange={(e) => setNewSale({...newSale, status: e.target.value})} className="new-sale-input">
            <option value="Completed">Completed</option>
            <option value="Processing">Processing</option>
            <option value="Pending">Pending</option>
          </select>
          <div className="new-sale-buttons">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Sale'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
