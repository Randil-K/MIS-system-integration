import { useEffect, useState } from 'react';
import { Package, TruckIcon, Clock, AlertCircle, CheckCircle, MapPin, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { api, Shipment, ShipmentVolume, DeliveryStatus, DashboardKpis } from '../services/api';

interface ShipmentDashboardProps {
  onTrackShipment: (id: string) => void;
}

export default function ShipmentDashboard({ onTrackShipment }: ShipmentDashboardProps) {
  const [kpis, setKpis] = useState<DashboardKpis | null>(null);
  const [volumeData, setVolumeData] = useState<ShipmentVolume[]>([]);
  const [statusData, setStatusData] = useState<DeliveryStatus[]>([]);
  const [recentList, setRecentList] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [kpisRes, volumeRes, statusRes, recentRes] = await Promise.all([
        api.getDashboardKpis(),
        api.getShipmentVolume(),
        api.getDeliveryStatus(),
        api.getRecentShipments(),
      ]);
      setKpis(kpisRes);
      setVolumeData(volumeRes);
      setStatusData(statusRes);
      setRecentList(recentRes);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch dashboard data. Please make sure the backend server is running on http://localhost:8080.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Shipment Dashboard</h1>
            <p className="text-slate-600">Computer Accessories Supply Chain Overview</p>
          </div>
          <button 
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
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

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200 relative overflow-hidden">
            {loading && <div className="absolute inset-0 bg-white/40 animate-pulse pointer-events-none" />}
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">+12%</span>
            </div>
            <h3 className="text-slate-600 text-sm mb-1">Active Shipments</h3>
            <p className="text-3xl font-bold text-slate-900">{kpis ? kpis.activeShipments : '...'}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200 relative overflow-hidden">
            {loading && <div className="absolute inset-0 bg-white/40 animate-pulse pointer-events-none" />}
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">+8%</span>
            </div>
            <h3 className="text-slate-600 text-sm mb-1">On-Time Delivery</h3>
            <p className="text-3xl font-bold text-slate-900">{kpis ? `${kpis.onTimeDeliveryPercent}%` : '...'}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200 relative overflow-hidden">
            {loading && <div className="absolute inset-0 bg-white/40 animate-pulse pointer-events-none" />}
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded">+3%</span>
            </div>
            <h3 className="text-slate-600 text-sm mb-1">Delayed Shipments</h3>
            <p className="text-3xl font-bold text-slate-900">{kpis ? kpis.delayedShipments : '...'}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200 relative overflow-hidden">
            {loading && <div className="absolute inset-0 bg-white/40 animate-pulse pointer-events-none" />}
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TruckIcon className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">+15%</span>
            </div>
            <h3 className="text-slate-600 text-sm mb-1">Fleet Utilization</h3>
            <p className="text-3xl font-bold text-slate-900">{kpis ? `${kpis.fleetUtilizationPercent}%` : '...'}</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Shipment Volume Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6 border border-slate-200 relative overflow-hidden min-h-[350px]">
            {loading && <div className="absolute inset-0 bg-white/40 animate-pulse pointer-events-none" />}
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Shipment Volume (Last 5 Months)</h3>
            {volumeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={volumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Bar dataKey="shipments" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">Loading chart...</div>
            )}
          </div>

          {/* Delivery Status Pie Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200 relative overflow-hidden min-h-[350px]">
            {loading && <div className="absolute inset-0 bg-white/40 animate-pulse pointer-events-none" />}
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Delivery Status</h3>
            {statusData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {statusData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm text-slate-600">{item.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">Loading chart...</div>
            )}
          </div>
        </div>

        {/* Recent Shipments Table */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 relative overflow-hidden">
          {loading && <div className="absolute inset-0 bg-white/40 animate-pulse pointer-events-none" />}
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">Recent Shipments</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Shipment ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Destination</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">ETA</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {recentList.length > 0 ? (
                  recentList.map((shipment) => (
                    <tr 
                      key={shipment.id} 
                      onClick={() => onTrackShipment(shipment.id)}
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-blue-600 hover:underline">{shipment.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-700">{shipment.product}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-700">{shipment.destination}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          shipment.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                          shipment.status === 'On Time' ? 'bg-blue-100 text-blue-700' :
                          shipment.status === 'Delayed' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {shipment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-700">{shipment.eta}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-slate-200 rounded-full h-2 min-w-[80px]">
                            <div
                              className={`h-2 rounded-full ${shipment.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                              style={{ width: `${shipment.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-slate-700 w-12">{shipment.progress}%</span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                      {loading ? 'Loading shipments...' : 'No shipments found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
