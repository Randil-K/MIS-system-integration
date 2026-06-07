import { useEffect, useState } from 'react';
import { 
  ArrowLeft, Package, Truck, MapPin, Clock, CheckCircle, Phone, Mail, 
  FileText, AlertTriangle, AlertCircle, RefreshCw 
} from 'lucide-react';
import { api, TrackingDetails } from '../services/api';

interface ShipmentTrackingProps {
  selectedShipmentId: string;
  onBackToDashboard: () => void;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  CheckCircle: CheckCircle,
  Truck: Truck,
  MapPin: MapPin,
  Package: Package,
  AlertTriangle: AlertTriangle,
  AlertCircle: AlertCircle
};

export default function ShipmentTracking({ selectedShipmentId, onBackToDashboard }: ShipmentTrackingProps) {
  const [currentShipmentId, setCurrentShipmentId] = useState(selectedShipmentId);
  const [searchId, setSearchId] = useState(selectedShipmentId);
  const [details, setDetails] = useState<TrackingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadDetails = async (idToLoad: string) => {
    if (!idToLoad) {
      setError('Please enter a Shipment ID or Tracking Number.');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      setActionMessage(null);
      const res = await api.getTrackingDetails(idToLoad);
      setDetails(res);
      setSearchId(res.id || idToLoad);
    } catch (err) {
      console.error(err);
      setError(`Shipment "${idToLoad}" not found. Verify the Shipment ID or Tracking Number and try again.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentShipmentId(selectedShipmentId);
    setSearchId(selectedShipmentId);
  }, [selectedShipmentId]);

  useEffect(() => {
    loadDetails(currentShipmentId);
  }, [currentShipmentId]);

  const handleSearch = () => {
    if (searchId.trim()) {
      setCurrentShipmentId(searchId.trim());
    }
  };

  const handleDownloadLabel = async () => {
    try {
      setActionLoading(true);
      setActionMessage(null);
      const message = await api.downloadLabel(currentShipmentId);
      
      // Simulate label download
      const element = document.createElement("a");
      const file = new Blob([`SHIPPING LABEL\nShipment ID: ${details?.id}\nTracking Number: ${details?.trackingNumber}\nProduct: ${details?.product}\nCarrier: ${details?.carrier}\nDestination: ${details?.destination}\nSender: ${details?.sender.name}\nRecipient: ${details?.recipient.name}`], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `label-${currentShipmentId}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      setActionMessage('Shipping label downloaded successfully!');
    } catch (err) {
      console.error(err);
      setActionMessage('Failed to download label.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReportIssue = async () => {
    if (!window.confirm("Are you sure you want to report an operational delay for this shipment?")) {
      return;
    }
    try {
      setActionLoading(true);
      setActionMessage(null);
      await api.reportIssue(currentShipmentId);
      setActionMessage('Operational delay reported successfully. Status updated to Delayed.');
      // Re-fetch details to update timeline
      await loadDetails(currentShipmentId);
    } catch (err) {
      console.error(err);
      setActionMessage('Failed to report issue.');
      setActionLoading(false);
    }
  };

  if (!currentShipmentId) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-md w-full text-center">
          <Package className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Track Your Shipment</h2>
          <p className="text-slate-600 mb-6">Enter a Shipment ID (e.g. SH-2026-1632) or Tracking Number to view status and timeline.</p>
          
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="Enter Shipment ID or Tracking #"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors font-medium"
            >
              Track
            </button>
          </div>

          <button 
            onClick={onBackToDashboard}
            className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (loading && !details) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-slate-600 font-medium">Fetching tracking data...</p>
        </div>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Tracking Error</h2>
          <p className="text-slate-600 mb-6">{error || 'Shipment details not found.'}</p>
          
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="Enter Shipment ID or Tracking #"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors font-medium"
            >
              Track
            </button>
          </div>

          <button 
            onClick={onBackToDashboard}
            className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <button 
              onClick={onBackToDashboard}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            
            {/* Search Bar */}
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="text"
                placeholder="Enter Shipment ID or Tracking #"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full md:w-64 px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
              >
                Track
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Shipment Tracking</h1>
              <p className="text-slate-600">Tracking ID: {details.trackingNumber}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-600 mb-1">Shipment ID</div>
              <div className="text-2xl font-bold text-blue-600">{details.id}</div>
            </div>
          </div>
        </div>

        {/* Action Status Toast Message */}
        {actionMessage && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg flex items-center justify-between shadow-sm">
            <span className="text-sm font-medium">{actionMessage}</span>
            <button onClick={() => setActionMessage(null)} className="text-blue-500 hover:text-blue-700 text-xs">Dismiss</button>
          </div>
        )}

        {/* Status Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-6 mb-6 text-white relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 rounded-lg backdrop-blur-sm">
                <Truck className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">{details.status}</h2>
                <p className="text-blue-100">
                  {details.status === 'Delivered' ? 'Your package has been successfully delivered' :
                   details.status === 'Delayed' ? 'Your package has been delayed due to an exception' :
                   'Your package is on its way to the destination'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-blue-100 text-sm mb-1">Estimated Delivery</div>
              <div className="text-2xl font-bold">{details.estimatedDelivery}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timeline */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative">
            {loading && <div className="absolute inset-0 bg-white/40 animate-pulse pointer-events-none" />}
            <h3 className="text-xl font-semibold text-slate-900 mb-6">Tracking Timeline</h3>

            <div className="relative">
              {details.events && details.events.length > 0 ? (
                details.events.map((event, index) => {
                  const EventIcon = iconMap[event.iconName] || Package;
                  return (
                    <div key={index} className="flex gap-4 pb-8 last:pb-0 relative">
                      {/* Timeline Line */}
                      {index !== details.events.length - 1 && (
                        <div className={`absolute left-6 top-14 w-0.5 h-full ${
                          event.completed ? 'bg-blue-500' : 'bg-slate-200'
                        }`}></div>
                      )}

                      {/* Icon */}
                      <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                        event.completed
                          ? 'bg-blue-100 text-blue-600'
                          : index === 0
                            ? 'bg-yellow-100 text-yellow-600 animate-pulse'
                            : 'bg-slate-100 text-slate-400'
                      }`}>
                        <EventIcon className="w-6 h-6" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 pt-1">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className={`font-semibold ${
                            event.completed ? 'text-slate-900' : index === 0 ? 'text-blue-600' : 'text-slate-400'
                          }`}>
                            {event.status}
                          </h4>
                          <span className={`text-sm ${
                            event.completed ? 'text-slate-500' : index === 0 ? 'text-blue-600' : 'text-slate-400'
                          }`}>
                            {event.timestamp}
                          </span>
                        </div>
                        <p className={`text-sm mb-1 ${
                          event.completed ? 'text-slate-600' : index === 0 ? 'text-slate-700' : 'text-slate-400'
                        }`}>
                          {event.description}
                        </p>
                        <div className={`flex items-center gap-1 text-sm ${
                          event.completed ? 'text-slate-500' : index === 0 ? 'text-blue-600' : 'text-slate-400'
                        }`}>
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-slate-400">No events logged yet for this shipment.</div>
              )}
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Package Details */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Package Details</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Product</div>
                  <div className="text-sm font-medium text-slate-900">{details.product}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Quantity</div>
                  <div className="text-sm font-medium text-slate-900">{details.quantity} units</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Weight</div>
                  <div className="text-sm font-medium text-slate-900">{details.weight}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Dimensions</div>
                  <div className="text-sm font-medium text-slate-900">{details.dimensions}</div>
                </div>
                <div className="pt-3 border-t border-slate-200">
                  <div className="text-xs text-slate-500 mb-1">Carrier</div>
                  <div className="text-sm font-medium text-slate-900">{details.carrier}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Service Type</div>
                  <div className="text-sm font-medium text-slate-900">{details.service}</div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Contact Information</h3>

              <div className="mb-4 pb-4 border-b border-slate-200">
                <div className="text-xs font-medium text-slate-500 mb-2">SENDER</div>
                <div className="text-sm font-medium text-slate-900 mb-2">{details.sender.name}</div>
                <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                  <Phone className="w-4 h-4" />
                  {details.sender.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Mail className="w-4 h-4" />
                  {details.sender.email}
                </div>
              </div>

              <div>
                <div className="text-xs font-medium text-slate-500 mb-2">RECIPIENT</div>
                <div className="text-sm font-medium text-slate-900 mb-2">{details.recipient.name}</div>
                <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                  <Phone className="w-4 h-4" />
                  {details.recipient.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                  <Mail className="w-4 h-4" />
                  {details.recipient.email}
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-600">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{details.recipient.address}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Actions</h3>
              <div className="space-y-2">
                <button 
                  onClick={handleDownloadLabel}
                  disabled={actionLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <FileText className="w-4 h-4" />
                  Download Label
                </button>
                <button 
                  onClick={handleReportIssue}
                  disabled={actionLoading || details.status === 'Delayed'}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Report Issue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
