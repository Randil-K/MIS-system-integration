import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../api';
import './ProductModal.css';

export default function ProductModal({ isOpen, onClose, productToEdit, onProductSaved }) {
  const [product, setProduct] = useState({ name: '', category: '', price: '', stock: '', description: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setProduct(productToEdit);
    } else {
      setProduct({ name: '', category: '', price: '', stock: '', description: '' });
    }
  }, [productToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const productData = {
        ...product,
        price: parseFloat(product.price),
        stock: parseInt(product.stock, 10)
      };

      if (productToEdit) {
        const response = await api.put(`/products/${productToEdit.id}`, productData);
        onProductSaved(response.data, true);
      } else {
        const response = await api.post('/products', productData);
        onProductSaved(response.data, false);
      }
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="product-modal-overlay">
      <div className="product-modal-content scale-in">
        <div className="modal-header">
          <h2>{productToEdit ? 'Edit Product' : 'Add New Product'}</h2>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label>Product Name</label>
            <input type="text" required value={product.name} onChange={(e) => setProduct({...product, name: e.target.value})} placeholder="e.g. Wireless Mouse" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <input type="text" required value={product.category} onChange={(e) => setProduct({...product, category: e.target.value})} placeholder="Electronics" />
            </div>
            <div className="form-group">
              <label>Price (LKR)</label>
              <input type="number" step="0.01" required value={product.price} onChange={(e) => setProduct({...product, price: e.target.value})} placeholder="0.00" />
            </div>
            <div className="form-group">
              <label>Stock Quantity</label>
              <input type="number" required value={product.stock} onChange={(e) => setProduct({...product, stock: e.target.value})} placeholder="0" />
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea rows="3" value={product.description} onChange={(e) => setProduct({...product, description: e.target.value})} placeholder="Product details..." />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
