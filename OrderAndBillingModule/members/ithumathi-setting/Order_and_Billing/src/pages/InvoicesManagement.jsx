import { useState, useEffect } from 'react';
import { Plus, Search, Filter, FileText, Trash2 } from 'lucide-react';
import api from '../api';
import GenerateInvoiceModal from '../components/GenerateInvoiceModal';
import './InvoicesManagement.css';

export default function InvoicesManagement() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await api.get('/invoices');
      setInvoices(response.data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvoiceGenerated = (newInvoice) => {
    setInvoices([...invoices, newInvoice]);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await api.delete(`/invoices/${id}`);
        setInvoices(invoices.filter(i => i.id !== id));
      } catch (error) {
        console.error('Error deleting invoice:', error);
      }
    }
  };

  return (
    <div className="main-content">
      <div className="header">
        <h1>Invoices</h1>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Generate Invoice
        </button>
      </div>

      <GenerateInvoiceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onInvoiceGenerated={handleInvoiceGenerated}
      />

      <div className="table-container">
        <div className="table-header">
          <div className="search-bar">
            <Search size={16} className="search-icon" />
            <input type="text" placeholder="Search invoices..." />
          </div>
          <div className="flex gap-2">
            <button className="btn btn-secondary"> <Filter size={16} /> Filter</button>
          </div>
        </div>
        {loading ? (
          <p>Loading invoices...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="col-invoice-id">{invoice.id}</td>
                  <td>{invoice.order && invoice.order.customer ? invoice.order.customer.name : 'Unknown'}</td>
                  <td className="col-date">{invoice.issueDate ? new Date(invoice.issueDate).toLocaleDateString() : 'N/A'}</td>
                  <td className="col-amount">{invoice.amount}</td>
                  <td>
                    <span className={`badge ${invoice.status === 'Paid' ? 'badge-success' : 'badge-warning'}`}>
                      {invoice.status || 'Pending'}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn-icon"><FileText size={16} /></button>
                      <button className="btn-icon text-danger" onClick={() => handleDelete(invoice.id)}>
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
