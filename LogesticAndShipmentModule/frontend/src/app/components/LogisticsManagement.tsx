import { useEffect, useState } from 'react';
import {
  Warehouse as WarehouseIcon, Truck, Package, MapPin, TrendingUp, Users,
  Fuel, Clock, Search, Filter, ChevronRight, X, AlertCircle, RefreshCw
} from 'lucide-react';
import { CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, XAxis, YAxis } from 'recharts';
import { api, Warehouse, FleetVehicle, FleetUtilization, LogisticsKpis } from '../services/api';

interface LogisticsManagementProps {
  onTrackShipment: (id: string) => void;
}

export default function LogisticsManagement({ onTrackShipment }: LogisticsManagementProps) {
  const [kpis, setKpis] = useState<LogisticsKpis | null>(null);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [vehicles, setVehicles] = useState<FleetVehicle[]>([]);
  const [utilizationData, setUtilizationData] = useState<FleetUtilization[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState(50);
  const [destination, setDestination] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [kpisRes, warehousesRes, vehiclesRes, utilizationRes] = await Promise.all([
        api.getLogisticsKpis(),
        api.getWarehouses(),
        api.getVehicles(),
        api.getFleetUtilization(),
      ]);
      setKpis(kpisRes);
      setWarehouses(warehousesRes);
      setVehicles(vehiclesRes);
      setUtilizationData(utilizationRes);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch logistics data. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !destination || !recipientName) {
      setFormMessage('Please fill out all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      setFormMessage(null);
      const newShipment = await api.createShipment({
        product: `${product} (${quantity} units)`,
        quantity,
        destination,
        recipientName,
        recipientEmail: recipientEmail || 'receiving@store.com',
        recipientPhone: recipientPhone || '+1 (555) 0199',
        recipientAddress: recipientAddress || `${destination} Main Warehouse`,
        status: 'In Transit',
        progress: 15,
        eta: '3 days'
      });

      setFormMessage('Shipment created successfully! Redirecting to tracking...');

      // Clear form
      setProduct('');
      setQuantity(50);
      setDestination('');
      setRecipientName('');
      setRecipientEmail('');
      setRecipientPhone('');
      setRecipientAddress('');

      // Wait a moment and navigate to tracking page
      setTimeout(() => {
        setIsModalOpen(false);
        onTrackShipment(newShipment.id);
      }, 1500);

    } catch (err) {
      console.error(err);
      setFormMessage('Failed to create shipment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter vehicles
  const filteredVehicles = vehicles.filter(v =>
    v.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Logistics & Fleet Management</h1>
            <p className="text-slate-600">Real-time warehouse and fleet operations monitoring</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={loadData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Package className="w-4 h-4" />
              New Shipment
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Backend Connection Issue</p>
              <p className="text-sm opacity-90">{error}</p>
            </div>
          </div>
        )}

        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
            {loading && <div className="absolute inset-0 bg-black/10 animate-pulse" />}
            <div className="flex items-center justify-between mb-4">
              <WarehouseIcon className="w-8 h-8 opacity-80" />
              <span className="text-xs bg-white/20 px-2 py-1 rounded">Active</span>
            </div>
            <h3 className="text-sm font-medium opacity-90 mb-1">Total Warehouses</h3>
            <p className="text-3xl font-bold">{kpis ? kpis.totalWarehouses : '...'}</p>
            <p className="text-xs opacity-80 mt-2">225K sq ft total capacity</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
            {loading && <div className="absolute inset-0 bg-black/10 animate-pulse" />}
            <div className="flex items-center justify-between mb-4">
              <Truck className="w-8 h-8 opacity-80" />
              <span className="text-xs bg-white/20 px-2 py-1 rounded">+12%</span>
            </div>
            <h3 className="text-sm font-medium opacity-90 mb-1">Active Fleet</h3>
            <p className="text-3xl font-bold">{kpis ? kpis.activeFleet : '...'}</p>
            <p className="text-xs opacity-80 mt-2">Fully deployed fleet vehicles</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
            {loading && <div className="absolute inset-0 bg-black/10 animate-pulse" />}
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 opacity-80" />
              <span className="text-xs bg-white/20 px-2 py-1 rounded">82% Target</span>
            </div>
            <h3 className="text-sm font-medium opacity-90 mb-1">Fleet Utilization</h3>
            <p className="text-3xl font-bold">{kpis ? `${kpis.fleetUtilizationPercent}%` : '...'}</p>
            <p className="text-xs opacity-80 mt-2">Above target (75%)</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
            {loading && <div className="absolute inset-0 bg-black/10 animate-pulse" />}
            <div className="flex items-center justify-between mb-4">
              <Fuel className="w-8 h-8 opacity-80" />
              <span className="text-xs bg-white/20 px-2 py-1 rounded">-8%</span>
            </div>
            <h3 className="text-sm font-medium opacity-90 mb-1">Fuel Efficiency</h3>
            <p className="text-3xl font-bold">{kpis ? kpis.fuelEfficiencyMpg : '...'}</p>
            <p className="text-xs opacity-80 mt-2">Miles per gallon avg</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Warehouse Status */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative">
            {loading && <div className="absolute inset-0 bg-white/40 animate-pulse pointer-events-none" />}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Warehouse Capacity</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium">
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {warehouses.length > 0 ? (
                warehouses.map((warehouse) => {
                  const utilization = (warehouse.current / warehouse.capacity) * 100;
                  const isNearCapacity = utilization > 85;

                  return (
                    <div key={warehouse.id} className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${isNearCapacity ? 'bg-orange-100' : 'bg-blue-100'}`}>
                            <WarehouseIcon className={`w-5 h-5 ${isNearCapacity ? 'text-orange-600' : 'text-blue-600'}`} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900">{warehouse.name}</h4>
                            <div className="flex items-center gap-1 text-sm text-slate-600 mt-1">
                              <MapPin className="w-3 h-3" />
                              {warehouse.location}
                            </div>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${isNearCapacity
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-green-100 text-green-700'
                          }`}>
                          {warehouse.status}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Capacity Utilization</span>
                          <span className="font-semibold text-slate-900">{utilization.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${isNearCapacity ? 'bg-orange-500' : 'bg-blue-500'}`}
                            style={{ width: `${utilization}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>{warehouse.current.toLocaleString()} units</span>
                          <span>{warehouse.capacity.toLocaleString()} max</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-600 pt-2 border-t border-slate-100">
                          <Package className="w-3 h-3" />
                          {warehouse.activeShipments} active shipments
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-slate-400">Loading warehouse data...</div>
              )}
            </div>
          </div>

          {/* Fleet Utilization Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative min-h-[350px]">
            {loading && <div className="absolute inset-0 bg-white/40 animate-pulse pointer-events-none" />}
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Weekly Fleet Utilization</h3>
            {utilizationData.length > 0 ? (
              <ResponsiveContainer width="100%" height={230}>
                <AreaChart data={utilizationData}>
                  <defs>
                    <linearGradient id="utilizationGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="utilization"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#utilizationGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[230px] flex items-center justify-center text-slate-400">Loading chart...</div>
            )}

            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-200">
              <div>
                <div className="text-xs text-slate-500 mb-1">Average</div>
                <div className="text-xl font-bold text-slate-900">74.4%</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Peak</div>
                <div className="text-xl font-bold text-green-600">88%</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Low</div>
                <div className="text-xl font-bold text-orange-600">58%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Fleet Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 relative overflow-hidden">
          {loading && <div className="absolute inset-0 bg-white/40 animate-pulse pointer-events-none" />}
          <div className="p-6 border-b border-slate-200 flex items-center justify-between flex-wrap gap-4">
            <h3 className="text-lg font-semibold text-slate-900">Active Fleet Tracking</h3>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search vehicles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Vehicle ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Driver</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Route</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Current Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Load</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">ETA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredVehicles.length > 0 ? (
                  filteredVehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-slate-900">{vehicle.id}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Users className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="text-slate-700">{vehicle.driver}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-slate-700 font-medium">{vehicle.route}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-700">{vehicle.location}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${vehicle.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                            vehicle.status === 'Loading' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                          }`}>
                          {vehicle.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-slate-200 rounded-full h-2 w-20">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${vehicle.loadPercent}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-slate-700">{vehicle.loadPercent}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-700">{vehicle.eta}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                      {loading ? 'Loading fleet vehicles...' : 'No fleet vehicles found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* New Shipment Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-lg">Create New Shipment</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleCreateShipment} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {formMessage && (
                <div className={`p-3 rounded-lg text-sm font-medium flex items-center gap-2 ${formMessage.includes('successfully')
                    ? 'bg-green-50 border border-green-200 text-green-700'
                    : 'bg-orange-50 border border-orange-200 text-orange-700'
                  }`}>
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Product Description *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mechanical Gaming Keyboards"
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Quantity (Units) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Destination City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. New York, NY"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Recipient Details</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Tech Distribution"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Email</label>
                      <input
                        type="email"
                        placeholder="receiving@apextech.com"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Phone</label>
                      <input
                        type="text"
                        placeholder="+1 (555) 0182"
                        value={recipientPhone}
                        onChange={(e) => setRecipientPhone(e.target.value)}
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Delivery Address</label>
                    <input
                      type="text"
                      placeholder="e.g. 500 Broadway, New York, NY 10001"
                      value={recipientAddress}
                      onChange={(e) => setRecipientAddress(e.target.value)}
                      className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 bg-slate-50 -mx-6 -my-6 px-6 py-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-50 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium transition-colors flex items-center gap-2"
                >
                  {submitting && <RefreshCw className="w-4 h-4 animate-spin" />}
                  Create Shipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
