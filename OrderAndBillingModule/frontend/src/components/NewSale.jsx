import { useState, useEffect } from 'react';
import { Plus, Trash2, ShoppingCart, Package } from 'lucide-react';
import api from '../api';
import './NewSale.css';

export default function NewSale({ isOpen, onClose, onSaleAdded }) {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [status, setStatus] = useState('Completed');
  const [items, setItems] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCustomers();
      fetchProducts();
      // Reset form
      setCustomerId('');
      setStatus('Completed');
      setItems([]);
      setSelectedProductId('');
      setQuantity(1);
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

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddItem = () => {
    if (!selectedProductId || quantity < 1) return;

    const product = products.find(p => p.id === parseInt(selectedProductId));
    if (!product) return;

    // Check if product already added
    const existingIndex = items.findIndex(item => item.productId === product.id);
    if (existingIndex >= 0) {
      const updatedItems = [...items];
      updatedItems[existingIndex].quantity += quantity;
      updatedItems[existingIndex].subtotal = updatedItems[existingIndex].quantity * product.price;
      setItems(updatedItems);
    } else {
      const newItem = {
        productId: product.id,
        productName: product.name,
        unitPrice: product.price,
        quantity: quantity,
        subtotal: product.price * quantity,
        stock: product.stock
      };
      setItems([...items, newItem]);
    }

    setSelectedProductId('');
    setQuantity(1);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleQuantityChange = (index, newQty) => {
    if (newQty < 1) return;
    const updatedItems = [...items];
    updatedItems[index].quantity = newQty;
    updatedItems[index].subtotal = updatedItems[index].unitPrice * newQty;
    setItems(updatedItems);
  };

  const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerId || items.length === 0) {
      alert('Please select a customer and add at least one item.');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        customer: { id: parseInt(customerId) },
        status: status,
        orderDate: new Date().toISOString(),
        totalAmount: totalAmount,
        items: items.map(item => ({
          product: { id: item.productId },
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal
        }))
      };
      const response = await api.post('/orders', orderData);
      onSaleAdded(response.data);
      setItems([]);
      setCustomerId('');
      setStatus('Completed');
    } catch (error) {
      console.error('Error adding sale:', error);
      const errMsg = error.response?.data?.message || error.response?.data?.error || error.message;
      alert(`Failed to add sale: ${errMsg || 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const selectedProduct = products.find(p => p.id === parseInt(selectedProductId));

  return (
    <div className="new-sale-modal-overlay">
      <div className="new-sale-modal-content">
        <div className="new-sale-header">
          <ShoppingCart size={22} />
          <h2>Create New Order</h2>
        </div>

        <form onSubmit={handleSubmit} className="new-sale-form">
          {/* Customer & Status */}
          <div className="new-sale-row">
            <div className="new-sale-field">
              <label>Customer</label>
              <select required value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="new-sale-input">
                <option value="">Select Customer</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="new-sale-field">
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="new-sale-input">
                <option value="Completed">Completed</option>
                <option value="Processing">Processing</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Add Item Section */}
          <div className="add-item-section">
            <label><Package size={14} /> Add Items</label>
            <div className="add-item-row">
              <select value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)} className="new-sale-input add-item-product">
                <option value="">Select Product</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} — LKR {p.price} (Stock: {p.stock})</option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                max={selectedProduct ? selectedProduct.stock : 9999}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="new-sale-input add-item-qty"
                placeholder="Qty"
              />
              <button type="button" className="btn btn-primary add-item-btn" onClick={handleAddItem} disabled={!selectedProductId}>
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Items List */}
          {items.length > 0 && (
            <div className="items-list">
              <div className="items-list-header">
                <span>Product</span>
                <span>Price</span>
                <span>Qty</span>
                <span>Subtotal</span>
                <span></span>
              </div>
              {items.map((item, index) => (
                <div key={index} className="item-row">
                  <span className="item-name">{item.productName}</span>
                  <span className="item-price">LKR {item.unitPrice.toFixed(2)}</span>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)}
                    className="item-qty-input"
                  />
                  <span className="item-subtotal">LKR {item.subtotal.toFixed(2)}</span>
                  <button type="button" className="btn-icon text-danger" onClick={() => handleRemoveItem(index)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <div className="items-total">
                <span>Total</span>
                <span className="total-amount">LKR {totalAmount.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="new-sale-buttons">
            <button type="submit" className="btn btn-primary" disabled={loading || items.length === 0}>
              {loading ? 'Saving...' : `Place Order (LKR ${totalAmount.toFixed(2)})`}
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
