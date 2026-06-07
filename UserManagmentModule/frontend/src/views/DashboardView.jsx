import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Users,
  UserCheck,
  ShieldAlert,
  ShieldCheck,
  Activity,
  ArrowRight,
  ShoppingCart,
  TrendingUp,
  Package,
  AlertTriangle,
  Truck,
  Warehouse,
  PlusCircle,
  RefreshCw,
  Clock,
  DollarSign
} from 'lucide-react';

export default function DashboardView({ user, setView }) {
  const [activities, setActivities] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true);

  // Admin stats
  const [stats, setStats] = useState({
    usersCount: 0,
    activeCount: 0,
    inactiveCount: 0,
  });

  // Manager stats (Order & Billing Module)
  const [managerData, setManagerData] = useState({
    orders: [],
    invoices: [],
    loading: false,
    error: null
  });

  // Supplier stats (Inventory Module)
  const [supplierData, setSupplierData] = useState({
    products: [],
    inventory: [],
    lowStock: [],
    loading: false,
    error: null
  });

  // Warehouse staff stats (Logistics Module)
  const [warehouseData, setWarehouseData] = useState({
    kpis: null,
    warehouses: [],
    vehicles: [],
    loading: false,
    error: null
  });

  // Supplier Restock form state
  const [restockProductId, setRestockProductId] = useState('');
  const [restockQty, setRestockQty] = useState('');
  const [restockRef, setRestockRef] = useState('');
  const [restockLoading, setRestockLoading] = useState(false);
  const [restockMessage, setRestockMessage] = useState(null);

  // Fetch standard logs
  const fetchLogs = async () => {
    try {
      setLoadingLogs(true);
      const actRes = await axios.get('/api/users/my-activities');
      setActivities(actRes.data.slice(0, 5));
    } catch (err) {
      console.error('Failed to load activity logs', err);
    } finally {
      setLoadingLogs(false);
    }
  };

  const fetchAdminData = async () => {
    try {
      const usersRes = await axios.get('/api/admin/users');
      const allUsers = usersRes.data;
      const active = allUsers.filter(u => u.status === 'ACTIVE').length;
      setStats({
        usersCount: allUsers.length,
        activeCount: active,
        inactiveCount: allUsers.length - active
      });
    } catch (err) {
      console.error('Failed to load admin stats', err);
    }
  };

  const fetchManagerData = async () => {
    try {
      setManagerData(prev => ({ ...prev, loading: true, error: null }));
      const [ordersRes, invoicesRes] = await Promise.all([
        axios.get('http://localhost:8082/api/orders'),
        axios.get('http://localhost:8082/api/invoices')
      ]);
      setManagerData({
        orders: ordersRes.data,
        invoices: invoicesRes.data,
        loading: false,
        error: null
      });
    } catch (err) {
      console.error('Failed to load SCM manager stats', err);
      setManagerData(prev => ({
        ...prev,
        loading: false,
        error: 'Order & Billing Service is offline (port 8082)'
      }));
    }
  };

  const fetchSupplierData = async () => {
    try {
      setSupplierData(prev => ({ ...prev, loading: true, error: null }));
      const [productsRes, inventoryRes, lowStockRes] = await Promise.all([
        axios.get('http://localhost:8081/api/products'),
        axios.get('http://localhost:8081/api/inventory'),
        axios.get('http://localhost:8081/api/inventory/low-stock')
      ]);
      setSupplierData({
        products: productsRes.data,
        inventory: inventoryRes.data,
        lowStock: lowStockRes.data,
        loading: false,
        error: null
      });
      
      const firstProd = productsRes.data[0];
      if (firstProd) {
        setRestockProductId(firstProd.productId || firstProd.id);
      }
    } catch (err) {
      console.error('Failed to load supplier stats', err);
      setSupplierData(prev => ({
        ...prev,
        loading: false,
        error: 'Inventory Service is offline (port 8081)'
      }));
    }
  };

  const fetchWarehouseData = async () => {
    try {
      setWarehouseData(prev => ({ ...prev, loading: true, error: null }));
      const [kpisRes, warehousesRes, vehiclesRes] = await Promise.all([
        axios.get('http://localhost:8080/api/dashboard/kpis'),
        axios.get('http://localhost:8080/api/logistics/warehouses'),
        axios.get('http://localhost:8080/api/logistics/vehicles')
      ]);
      setWarehouseData({
        kpis: kpisRes.data,
        warehouses: warehousesRes.data,
        vehicles: vehiclesRes.data,
        loading: false,
        error: null
      });
    } catch (err) {
      console.error('Failed to load logistics stats', err);
      setWarehouseData(prev => ({
        ...prev,
        loading: false,
        error: 'Logistics Service is offline (port 8080)'
      }));
    }
  };

  useEffect(() => {
    fetchLogs();
    if (user.role === 'ADMIN') {
      fetchAdminData();
    } else if (user.role === 'MANAGER') {
      fetchManagerData();
    } else if (user.role === 'SUPPLIER') {
      fetchSupplierData();
    } else if (user.role === 'WAREHOUSE_STAFF') {
      fetchWarehouseData();
    }
  }, [user]);

  // Operations
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:8082/api/orders/${orderId}/status?status=${newStatus}`);
      fetchManagerData();
    } catch (err) {
      console.error('Failed to update order status', err);
      alert('Failed to update order status.');
    }
  };

  const handleRestock = async (e) => {
    e.preventDefault();
    if (!restockProductId || !restockQty || restockQty <= 0) {
      alert('Please fill in a valid product and supply quantity.');
      return;
    }
    try {
      setRestockLoading(true);
      setRestockMessage(null);
      await axios.post('http://localhost:8081/api/inventory/add', {
        productId: Number(restockProductId),
        quantity: Number(restockQty),
        referenceDoc: restockRef.trim() || 'Supplier Console Restock'
      });
      setRestockMessage({ type: 'success', text: 'Stock supplied successfully!' });
      setRestockQty('');
      setRestockRef('');
      fetchSupplierData();
    } catch (err) {
      console.error('Restock failed', err);
      setRestockMessage({ type: 'error', text: 'Failed to restock inventory.' });
    } finally {
      setRestockLoading(false);
    }
  };

  const handleUpdateVehicleStatus = async (vehicleId, newStatus) => {
    try {
      const vehicle = warehouseData.vehicles.find(v => v.id === vehicleId);
      if (!vehicle) return;
      await axios.put(`http://localhost:8080/api/logistics/vehicles/${vehicleId}`, {
        ...vehicle,
        status: newStatus
      });
      fetchWarehouseData();
    } catch (err) {
      console.error('Failed to update vehicle status', err);
      alert('Failed to update vehicle status.');
    }
  };

  // Render Functions
  const renderCards = () => {
    let cards = [];
    if (user.role === 'ADMIN') {
      cards = [
        { title: 'Total Registered Users', value: stats.usersCount, desc: 'All system accounts', icon: Users, color: 'var(--color-primary)' },
        { title: 'Active Accounts', value: stats.activeCount, desc: 'Active system users', icon: UserCheck, color: 'var(--color-success)' },
        { title: 'Deactivated Accounts', value: stats.inactiveCount, desc: 'Locked system users', icon: ShieldAlert, color: 'var(--color-danger)' }
      ];
    } else if (user.role === 'MANAGER') {
      const totalRevenue = managerData.invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
      const pendingOrders = managerData.orders.filter(o => o.status === 'PENDING').length;
      cards = [
        { title: 'Total SCM Orders', value: managerData.orders.length, desc: 'Registered customer purchases', icon: ShoppingCart, color: 'var(--color-primary)' },
        { title: 'Pending Orders', value: pendingOrders, desc: 'Awaiting fulfillment', icon: Clock, color: 'var(--color-warning)' },
        { title: 'Total Invoiced Revenue', value: `$${totalRevenue.toFixed(2)}`, desc: 'Successfully billed revenue', icon: DollarSign, color: 'var(--color-success)' }
      ];
    } else if (user.role === 'SUPPLIER') {
      const totalStock = supplierData.inventory.reduce((sum, inv) => sum + (inv.quantityOnHand || 0), 0);
      cards = [
        { title: 'Total Products Supplied', value: supplierData.products.length, desc: 'Active catalog listings', icon: Package, color: 'var(--color-primary)' },
        { title: 'Low Stock Alerts', value: supplierData.lowStock.length, desc: 'Items below reorder limit', icon: AlertTriangle, color: 'var(--color-danger)' },
        { title: 'Total Stock Quantity', value: totalStock, desc: 'Current on-hand warehouse volume', icon: TrendingUp, color: 'var(--color-success)' }
      ];
    } else if (user.role === 'WAREHOUSE_STAFF') {
      const activeShip = warehouseData.kpis ? warehouseData.kpis.activeShipments : 0;
      const delayedShip = warehouseData.kpis ? warehouseData.kpis.delayedShipments : 0;
      const utilization = warehouseData.kpis ? `${warehouseData.kpis.fleetUtilizationPercent}%` : '0%';
      cards = [
        { title: 'Active Shipments', value: activeShip, desc: 'In-transit shipment packages', icon: Truck, color: 'var(--color-primary)' },
        { title: 'Delayed Shipments', value: delayedShip, desc: 'Blocked or exception items', icon: AlertTriangle, color: 'var(--color-danger)' },
        { title: 'Fleet Vehicle Utilization', value: utilization, desc: 'Active vs total fleet capacity', icon: Warehouse, color: 'var(--color-success)' }
      ];
    }

    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
      }}>
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="glass-panel glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '8px',
                background: `#f8fafc`,
                border: `1px solid var(--border-glass)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: card.color,
                flexShrink: 0
              }}>
                <Icon size={20} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>{card.title}</p>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800', margin: '2px 0', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{card.value}</h3>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {card.desc}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderManagerDashboard = () => {
    if (managerData.error) {
      return (
        <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px', borderLeft: '4px solid var(--color-danger)' }}>
          <p style={{ color: 'var(--color-danger)', fontWeight: '600', fontSize: '0.85rem' }}>{managerData.error}</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Could not load business metrics. Ensure the Order & Billing microservice is active.</p>
        </div>
      );
    }

    return (
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Orders List */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '15px', color: 'var(--text-main)' }}>Orders Management Dashboard</h4>
          {managerData.loading ? (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Loading orders...</p>
          ) : managerData.orders.length === 0 ? (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No customer orders found.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-glass)', textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '8px' }}>Order ID</th>
                    <th style={{ padding: '8px' }}>Customer</th>
                    <th style={{ padding: '8px' }}>Amount</th>
                    <th style={{ padding: '8px' }}>Status</th>
                    <th style={{ padding: '8px' }}>Fulfillment Control</th>
                  </tr>
                </thead>
                <tbody>
                  {managerData.orders.slice(0, 10).map(order => (
                    <tr key={order.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                      <td style={{ padding: '8px', fontWeight: '600' }}>#{order.id}</td>
                      <td style={{ padding: '8px' }}>{order.customer ? order.customer.name : 'Guest'}</td>
                      <td style={{ padding: '8px', fontWeight: '600' }}>${(order.totalAmount || 0).toFixed(2)}</td>
                      <td style={{ padding: '8px' }}>
                        <span className={`badge badge-${order.status === 'COMPLETED' ? 'success' : order.status === 'CANCELLED' ? 'danger' : 'warning'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: '8px' }}>
                        <select 
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            border: '1px solid var(--border-glass)',
                            background: 'white',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: 'var(--text-main)'
                          }}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Invoices List */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '15px', color: 'var(--text-main)' }}>Latest Generated Invoices</h4>
          {managerData.loading ? (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Loading invoices...</p>
          ) : managerData.invoices.length === 0 ? (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No invoices generated yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {managerData.invoices.slice(0, 5).map(inv => (
                <div key={inv.id} style={{
                  padding: '10px',
                  background: '#f8fafc',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-glass)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-main)' }}>INV-{inv.invoiceNumber}</span>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>Order #{inv.order ? inv.order.id : 'N/A'}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-main)' }}>${(inv.amount || 0).toFixed(2)}</span>
                    <p style={{ fontSize: '0.65rem', color: 'var(--color-success)', margin: '2px 0 0 0', fontWeight: '600' }}>{inv.paymentStatus || 'PAID'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSupplierDashboard = () => {
    if (supplierData.error) {
      return (
        <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px', borderLeft: '4px solid var(--color-danger)' }}>
          <p style={{ color: 'var(--color-danger)', fontWeight: '600', fontSize: '0.85rem' }}>{supplierData.error}</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Could not load supply chain levels. Ensure the Inventory microservice is active.</p>
        </div>
      );
    }

    return (
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Low Stock Alerts */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '15px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertTriangle size={15} style={{ color: 'var(--color-danger)' }} />
            <span>Low Stock Restock Alerts</span>
          </h4>
          {supplierData.loading ? (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Loading low stock alerts...</p>
          ) : supplierData.lowStock.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', background: '#f0fdf4', borderRadius: '8px', border: '1px dashed var(--color-success)' }}>
              <p style={{ fontSize: '0.8rem', color: '#166534', fontWeight: '600', margin: 0 }}>All inventory items are fully stocked!</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-glass)', textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '8px' }}>Product</th>
                    <th style={{ padding: '8px' }}>Current Stock</th>
                    <th style={{ padding: '8px' }}>Min Threshold</th>
                    <th style={{ padding: '8px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {supplierData.lowStock.map(inv => {
                    const prodName = supplierData.products.find(p => (p.productId || p.id) === inv.productId)?.name || `Product ID ${inv.productId}`;
                    return (
                      <tr key={inv.inventoryId || inv.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                        <td style={{ padding: '8px', fontWeight: '600' }}>{prodName}</td>
                        <td style={{ padding: '8px', color: 'var(--color-danger)', fontWeight: '700' }}>{inv.quantityOnHand} units</td>
                        <td style={{ padding: '8px' }}>{inv.reorderLevel || 10}</td>
                        <td style={{ padding: '8px' }}>
                          <span className="badge badge-danger">CRITICAL LOW</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Restock Form */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '15px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <PlusCircle size={15} style={{ color: 'var(--color-success)' }} />
            <span>Supply Stock To Warehouse</span>
          </h4>
          
          {restockMessage && (
            <div style={{
              padding: '8px 12px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: '600',
              marginBottom: '12px',
              border: `1px solid ${restockMessage.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
              background: restockMessage.type === 'success' ? '#f0fdf4' : '#fef2f2',
              color: restockMessage.type === 'success' ? '#166534' : '#991b1b'
            }}>
              {restockMessage.text}
            </div>
          )}

          <form onSubmit={handleRestock} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Product Catalog</label>
              <select
                value={restockProductId}
                onChange={(e) => setRestockProductId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-glass)',
                  fontSize: '0.8rem',
                  outline: 'none'
                }}
              >
                {supplierData.products.map(p => (
                  <option key={p.productId || p.id} value={p.productId || p.id}>
                    {p.name} (SKU: {p.sku})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Quantity to Supply</label>
              <input
                type="number"
                min="1"
                placeholder="100"
                value={restockQty}
                onChange={(e) => setRestockQty(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-glass)',
                  fontSize: '0.8rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Reference Document #</label>
              <input
                type="text"
                placeholder="REF-INBOUND-01"
                value={restockRef}
                onChange={(e) => setRestockRef(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-glass)',
                  fontSize: '0.8rem',
                  outline: 'none'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={restockLoading || supplierData.products.length === 0}
              className="btn btn-primary"
              style={{
                marginTop: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px'
              }}
            >
              {restockLoading ? 'Supplying...' : 'Deliver Stock Inbound'}
            </button>
          </form>
        </div>
      </div>
    );
  };

  const renderWarehouseDashboard = () => {
    if (warehouseData.error) {
      return (
        <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px', borderLeft: '4px solid var(--color-danger)' }}>
          <p style={{ color: 'var(--color-danger)', fontWeight: '600', fontSize: '0.85rem' }}>{warehouseData.error}</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Could not load logistics console. Ensure the Logistics microservice is active.</p>
        </div>
      );
    }

    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Warehouses list */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '15px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Warehouse size={15} style={{ color: 'var(--color-primary)' }} />
            <span>Warehouses Capacity Dashboard</span>
          </h4>
          {warehouseData.loading ? (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Loading warehouses...</p>
          ) : warehouseData.warehouses.length === 0 ? (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No warehouse storage zones registered.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {warehouseData.warehouses.map(w => {
                const percent = Math.min(100, Math.round((w.current / w.capacity) * 100));
                return (
                  <div key={w.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <div>
                        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)' }}>{w.name}</span>
                        <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', margin: 0 }}>Location: {w.location}</p>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: '600', color: percent > 85 ? 'var(--color-danger)' : 'var(--text-main)' }}>
                        {w.current} / {w.capacity} Units ({percent}%)
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${percent}%`,
                        height: '100%',
                        background: percent > 85 ? 'var(--color-danger)' : percent > 50 ? 'var(--color-warning)' : 'var(--color-success)',
                        borderRadius: '4px'
                      }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Fleet Vehicles list */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '15px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Truck size={15} style={{ color: 'var(--color-success)' }} />
            <span>Active Fleet Status Control</span>
          </h4>
          {warehouseData.loading ? (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Loading fleet vehicles...</p>
          ) : warehouseData.vehicles.length === 0 ? (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No logistics fleet vehicles registered.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-glass)', textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '8px' }}>Driver</th>
                    <th style={{ padding: '8px' }}>Route</th>
                    <th style={{ padding: '8px' }}>Load</th>
                    <th style={{ padding: '8px' }}>Status</th>
                    <th style={{ padding: '8px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {warehouseData.vehicles.slice(0, 6).map(veh => (
                    <tr key={veh.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                      <td style={{ padding: '8px', fontWeight: '600' }}>{veh.driver}</td>
                      <td style={{ padding: '8px' }}>{veh.route || 'Local Dispatch'}</td>
                      <td style={{ padding: '8px' }}>{veh.loadPercent}%</td>
                      <td style={{ padding: '8px' }}>
                        <span className={`badge badge-${veh.status === 'AVAILABLE' ? 'success' : veh.status === 'IN_TRANSIT' ? 'primary' : 'warning'}`}>
                          {veh.status}
                        </span>
                      </td>
                      <td style={{ padding: '8px' }}>
                        <select 
                          value={veh.status}
                          onChange={(e) => handleUpdateVehicleStatus(veh.id, e.target.value)}
                          style={{
                            padding: '4px',
                            borderRadius: '4px',
                            border: '1px solid var(--border-glass)',
                            background: 'white',
                            fontSize: '0.7rem',
                            fontWeight: '600'
                          }}
                        >
                          <option value="AVAILABLE">AVAILABLE</option>
                          <option value="IN_TRANSIT">IN_TRANSIT</option>
                          <option value="MAINTENANCE">MAINTENANCE</option>
                          <option value="DELAYED">DELAYED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="page-container animate-fade-in">
      {/* Welcome Banner */}
      <div className="glass-panel" style={{
        padding: '24px',
        marginBottom: '24px',
        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(2, 132, 199, 0.02) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '6px', color: 'var(--text-main)' }}>
            Welcome back, {user.name.split(' ')[0]}!
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '750px', lineHeight: '1.4' }}>
            You are logged in as <strong style={{ color: 'var(--color-primary)' }}>{user.role.replace('_', ' ')}</strong>.
            {user.role === 'ADMIN' && ' You can manage system profiles, toggle statuses, and audit security log events across the entire integrated cluster.'}
            {user.role === 'MANAGER' && ' You are authorized as an SCM Manager. Below you can monitor sales invoices, evaluate revenue KPIs, and dispatch/process customer orders.'}
            {user.role === 'SUPPLIER' && ' You are authorized as a Supplier. Below you can check low stock levels on the warehouse grid and quick-supply inbound cargo to restock.'}
            {user.role === 'WAREHOUSE_STAFF' && ' You are authorized as Warehouse Staff. Below you can manage inventory storage capacities, verify logistics loads, and command active fleet vehicle statuses.'}
          </p>
        </div>
        <div style={{
          padding: '6px 12px',
          background: '#dcfce7',
          borderRadius: 'var(--radius-md)',
          border: '1px solid #bbf7d0',
          fontSize: '0.75rem',
          color: '#166534',
          fontWeight: '600'
        }}>
          Status: Online
        </div>
      </div>

      {/* KPI Cards Grid */}
      {renderCards()}

      {/* Role-Specific Control Dashboards */}
      {user.role === 'MANAGER' && renderManagerDashboard()}
      {user.role === 'SUPPLIER' && renderSupplierDashboard()}
      {user.role === 'WAREHOUSE_STAFF' && renderWarehouseDashboard()}

      {/* User Activity Logs Stream */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)' }}>
            <Activity size={15} style={{ color: 'var(--color-primary)' }} />
            <span>Recent Activity Logs (User Console)</span>
          </h3>
          <button
            onClick={() => setView('profile')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '0.7rem',
              color: 'var(--color-primary)',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '2px'
            }}
          >
            View All <ArrowRight size={10} />
          </button>
        </div>

        {loadingLogs ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', padding: '20px 0' }}>Loading logs...</p>
        ) : activities.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', padding: '20px 0' }}>
            No activities logged yet.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {activities.map((act) => (
              <div key={act.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                padding: '12px 16px',
                background: '#f8fafc',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-md)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'var(--color-primary)'
                  }} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: '500' }}>{act.action}</span>
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {new Date(act.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
