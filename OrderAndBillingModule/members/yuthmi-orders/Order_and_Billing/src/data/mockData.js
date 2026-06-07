export const recentOrders = [
  { id: 'ORD-8491', customer: 'P.W.N.Perera', date: '2026-05-05', amount: 'LKR 28,500', status: 'Completed' },
  { id: 'ORD-8492', customer: 'H.M.L.Sandaruwan', date: '2026-05-05', amount: 'LKR 105,000', status: 'Processing' },
  { id: 'ORD-8494', customer: 'R.L.M.Silva', date: '2026-05-04', amount: 'LKR 13,200', status: 'Pending' },
  { id: 'ORD-8495', customer: 'A.K.Dissanayake', date: '2026-05-04', amount: 'LKR 45,000', status: 'Completed' },
  { id: 'ORD-8496', customer: 'S.M.Fernando', date: '2026-05-03', amount: 'LKR 8,900', status: 'Processing' },
];

export const mockCustomers = [
  { id: 'CUST-001', name: 'P.W.N.Perera', email: 'pwnperera@example.com', phone: '071-234-5678', status: 'Active' },
  { id: 'CUST-002', name: 'H.M.L.Sandaruwan', email: 'sandaruwan@example.com', phone: '077-987-6543', status: 'Active' },
  { id: 'CUST-003', name: 'R.L.M.Silva', email: 'silvarlm@example.com', phone: '070-112-2334', status: 'Inactive' },
  { id: 'CUST-004', name: 'A.K.Dissanayake', email: 'akdiss@example.com', phone: '072-555-4444', status: 'Active' },
];

export const mockInvoices = [
  { id: 'INV-1042', customer: 'P.W.N.Perera', date: '2026-05-05', amount: 'LKR 28,500', status: 'Ready' },
  { id: 'INV-1043', customer: 'H.M.L.Sandaruwan', date: '2026-05-05', amount: 'LKR 105,000', status: 'Pending' },
  { id: 'INV-1044', customer: 'A.K.Dissanayake', date: '2026-05-04', amount: 'LKR 45,000', status: 'Ready' },
  { id: 'INV-1045', customer: 'S.M.Fernando', date: '2026-05-03', amount: 'LKR 8,900', status: 'Pending' }
];

export const mockProducts = [
  { id: 'PRD-101', name: 'Kensington Mechanical Keyboard', category: 'Peripherals', price: 'LKR 10,500', stock: '24', status: 'Active', image: '/keyboard.png' },
  { id: 'PRD-102', name: 'XE Wireless Gaming Mouse', category: 'Peripherals', price: 'LKR 7,500', stock: '15', status: 'Active', image: '/mouse.png' },
  { id: 'PRD-103', name: 'UltraVision 34" Curved Monitor', category: 'Displays', price: 'LKR 49,900', stock: '3', status: 'Low Stock', image: '/monitor.png' },
  { id: 'PRD-104', name: 'RTX 4080 Super GPU', category: 'Components', price: 'LKR 99,000', stock: 'Out of Stock', status: 'Inactive', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=150&h=150' },
  { id: 'PRD-105', name: 'Quantum Core i9 Processor', category: 'Components', price: 'LKR 41,500', stock: '12', status: 'Active', image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=150&h=150' },
];
