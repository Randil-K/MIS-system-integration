import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Search,
  Plus,
  AlertTriangle,
  UserX,
  UserCheck,
  Edit,
  Trash2,
  X
} from 'lucide-react';

export default function UserManagementView() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [role, setRole] = useState('SUPPLIER');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('ACTIVE');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get('/api/admin/users');
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch users list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !contactNumber) {
      setError('Please fill in all details.');
      return;
    }

    try {
      setError(null);
      await axios.post('/api/admin/users', { name, email, contactNumber, role, password });
      setShowAddModal(false);
      resetForm();
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create user account.');
    }
  };

  const openEditModal = (user) => {
    setCurrentUser(user);
    setName(user.name);
    setEmail(user.email);
    setContactNumber(user.contactNumber || '');
    setRole(user.role);
    setStatus(user.status);
    setShowEditModal(true);
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      await axios.put(`/api/admin/users/${currentUser.id}`, { name, email, contactNumber, role, status });
      setShowEditModal(false);
      resetForm();
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update user account details.');
    }
  };

  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      setError(null);
      await axios.put(`/api/admin/users/${user.id}/status`, { status: nextStatus });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to modify account status.');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to remove this user from the system?')) {
      return;
    }

    try {
      setError(null);
      await axios.delete(`/api/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete user.');
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setContactNumber('');
    setRole('SUPPLIER');
    setPassword('');
    setStatus('ACTIVE');
    setCurrentUser(null);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                          u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="page-container animate-fade-in">
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '25px', display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Search */}
        <div style={{ position: 'relative', flex: '1', minWidth: '250px' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="input-field"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '40px' }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <select
            className="input-field"
            style={{ width: '150px' }}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="MANAGER">Manager</option>
            <option value="SUPPLIER">Supplier</option>
            <option value="WAREHOUSE_STAFF">Warehouse Staff</option>
          </select>

          <select
            className="input-field"
            style={{ width: '130px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>

          <button className="btn btn-primary" onClick={() => { resetForm(); setShowAddModal(true); }}>
            <Plus size={16} />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          background: '#fee2e2',
          border: '1px solid #fca5a5',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          color: 'var(--color-danger)',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '20px'
        }}>
          <AlertTriangle size={16} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {/* Users Table */}
      <div className="glass-panel" style={{ padding: '10px', overflow: 'hidden' }}>
        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '50px 0' }}>Loading users...</p>
        ) : filteredUsers.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '50px 0' }}>No users match search criteria.</p>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Contact Number</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: '#f1f5f9',
                          border: '1px solid var(--border-glass)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          color: 'var(--color-primary)',
                          fontSize: '0.85rem'
                        }}>
                          {u.name.charAt(0)}
                        </div>
                        <span style={{ fontWeight: '600' }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                    <td>{u.contactNumber || 'N/A'}</td>
                    <td>
                      <span className={`badge badge-${
                        u.role === 'ADMIN' ? 'admin' :
                        u.role === 'MANAGER' ? 'manager' :
                        u.role === 'SUPPLIER' ? 'supplier' : 'staff'
                      }`}>
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${u.status === 'ACTIVE' ? 'active' : 'inactive'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          className="btn btn-secondary btn-icon"
                          onClick={() => handleToggleStatus(u)}
                          title={u.status === 'ACTIVE' ? 'Deactivate User' : 'Activate User'}
                        >
                          {u.status === 'ACTIVE' ? <UserX size={14} style={{ color: 'var(--color-warning)' }} /> : <UserCheck size={14} style={{ color: 'var(--color-success)' }} />}
                        </button>
                        
                        <button
                          className="btn btn-secondary btn-icon"
                          onClick={() => openEditModal(u)}
                          title="Edit User"
                        >
                          <Edit size={14} style={{ color: 'var(--color-secondary)' }} />
                        </button>
                        
                        <button
                          className="btn btn-secondary btn-icon"
                          onClick={() => handleDeleteUser(u.id)}
                          title="Delete User"
                        >
                          <Trash2 size={14} style={{ color: 'var(--color-danger)' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Add New User</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleAddUser}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" className="input-field" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="input-field" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Number</label>
                <input type="text" className="input-field" placeholder="Phone" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input type="password" className="input-field" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="input-field" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="ADMIN">Admin</option>
                  <option value="MANAGER">Manager</option>
                  <option value="SUPPLIER">Supplier</option>
                  <option value="WAREHOUSE_STAFF">Warehouse Staff</option>
                </select>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Edit User</h3>
              <button className="modal-close" onClick={() => setShowEditModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleEditUser}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" className="input-field" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Number</label>
                <input type="text" className="input-field" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="input-field" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="ADMIN">Admin</option>
                  <option value="MANAGER">Manager</option>
                  <option value="SUPPLIER">Supplier</option>
                  <option value="WAREHOUSE_STAFF">Warehouse Staff</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="input-field" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
