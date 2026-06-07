import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit2, Trash2 } from 'lucide-react';
import api from '../api';
import ProductModal from '../components/ProductModal';
import './ProductManagement.css';

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleProductSaved = (savedProduct, isEdit) => {
    if (isEdit) {
      setProducts(products.map(p => p.id === savedProduct.id ? savedProduct : p));
    } else {
      setProducts([...products, savedProduct]);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        setProducts(products.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  return (
    <div className="main-content">
      <div className="header">
        <h1>Inventory</h1>
        <button className="btn btn-primary" onClick={handleAddClick}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        productToEdit={productToEdit}
        onProductSaved={handleProductSaved}
      />

      <div className="table-container">
        <div className="table-header">
          <div className="search-bar">
            <Search size={16} className="search-icon" />
            <input type="text" placeholder="Search components, peripherals..." />
          </div>
          <div className="flex gap-2">
            <button className="btn btn-secondary"><Filter size={16} /> Filter</button>
          </div>
        </div>
        {loading ? (
          <p>Loading products...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="product-info">
                      <div>
                        <div className="product-name">{product.name}</div>
                        <div className="product-id">{product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="col-category">{product.category}</td>
                  <td className="col-price">{product.price}</td>
                  <td>
                    {product.stock === 0 ? (
                      <span className="text-danger font-medium">Out of Stock</span>
                    ) : product.stock <= 3 ? (
                      <span className="text-warning font-medium">{product.stock} (Low)</span>
                    ) : (
                      <span>{product.stock}</span>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${product.stock > 3 ? 'badge-success' : product.stock > 0 ? 'badge-warning' : 'badge-danger'}`}>
                      {product.stock > 3 ? 'Active' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn-icon" onClick={() => handleEditClick(product)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="btn-icon text-danger" onClick={() => handleDelete(product.id)}>
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
