import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit2, Trash2 } from 'lucide-react';
import api from '../api';
import CustomerModal from '../components/CustomerModal';
import './CustomersManagement.css';

export default function CustomersManagement() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/customers');
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setCustomerToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (customer) => {
    setCustomerToEdit(customer);
    setIsModalOpen(true);
  };

  const handleCustomerSaved = (savedCustomer, isEdit) => {
    if (isEdit) {
      setCustomers(customers.map(c => c.id === savedCustomer.id ? savedCustomer : c));
    } else {
      setCustomers([...customers, savedCustomer]);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await api.delete(`/customers/${id}`);
        setCustomers(customers.filter(c => c.id !== id));
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  return (
    <div className="main-content">
      <div className="header">
        <h1>Customers</h1>
        <button className="btn btn-primary" onClick={handleAddClick}>
          <Plus size={16} /> Add Customer
        </button>
      </div>

      <CustomerModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        customerToEdit={customerToEdit}
        onCustomerSaved={handleCustomerSaved}
      />

      <div className="table-container">
        <div className="table-header">
          <div className="search-bar">
            <Search size={16} className="search-icon" />
            <input type="text" placeholder="Search customers..." />
          </div>
          <div className="flex gap-2">
            <button className="btn btn-secondary"><Filter size={16} /> Filter</button>
          </div>
        </div>
        {loading ? (
          <p>Loading customers...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td className="col-customer-id">{customer.id}</td>
                  <td className="col-name">{customer.name}</td>
                  <td className="col-email">{customer.email}</td>
                  <td className="col-phone">{customer.phone}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn-icon" onClick={() => handleEditClick(customer)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="btn-icon text-danger" onClick={() => handleDelete(customer.id)}>
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
