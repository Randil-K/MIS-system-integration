import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../api';
import './CustomerModal.css';

export default function CustomerModal({ isOpen, onClose, customerToEdit, onCustomerSaved }) {
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customerToEdit) {
      setCustomer(customerToEdit);
    } else {
      setCustomer({ name: '', email: '', phone: '', address: '' });
    }
  }, [customerToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (customerToEdit) {
        const response = await api.put(`/customers/${customerToEdit.id}`, customer);
        onCustomerSaved(response.data, true); // true indicates edit
      } else {
        const response = await api.post('/customers', customer);
        onCustomerSaved(response.data, false); // false indicates new
      }
      onClose();
    } catch (error) {
      console.error('Error saving customer:', error);
      alert('Failed to save customer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="customer-modal-overlay">
      <div className="customer-modal-content slide-in">
        <div className="modal-header">
          <h2>{customerToEdit ? 'Edit Customer' : 'Add New Customer'}</h2>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="customer-form">
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" required value={customer.name} onChange={(e) => setCustomer({...customer, name: e.target.value})} placeholder="e.g. John Doe" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" value={customer.email} onChange={(e) => setCustomer({...customer, email: e.target.value})} placeholder="john@example.com" />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" value={customer.phone} onChange={(e) => setCustomer({...customer, phone: e.target.value})} placeholder="0771234567" />
            </div>
          </div>
          <div className="form-group">
            <label>Address</label>
            <textarea rows="3" value={customer.address} onChange={(e) => setCustomer({...customer, address: e.target.value})} placeholder="123 Main St, City" />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
