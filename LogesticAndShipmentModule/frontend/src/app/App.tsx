import { useState } from 'react';
import ShipmentDashboard from './components/ShipmentDashboard';
import ShipmentTracking from './components/ShipmentTracking';
import LogisticsManagement from './components/LogisticsManagement';

export default function App() {
  const [activeDesign, setActiveDesign] = useState<'dashboard' | 'tracking' | 'logistics'>('dashboard');
  const [selectedShipmentId, setSelectedShipmentId] = useState<string>('');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveDesign('dashboard')}
              className={`px-6 py-4 font-medium text-sm transition-colors relative ${
                activeDesign === 'dashboard'
                  ? 'text-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dashboard Overview
              {activeDesign === 'dashboard' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveDesign('tracking')}
              className={`px-6 py-4 font-medium text-sm transition-colors relative ${
                activeDesign === 'tracking'
                  ? 'text-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Shipment Tracking
              {activeDesign === 'tracking' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveDesign('logistics')}
              className={`px-6 py-4 font-medium text-sm transition-colors relative ${
                activeDesign === 'logistics'
                  ? 'text-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Logistics Management
              {activeDesign === 'logistics' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Active Design Content */}
      {activeDesign === 'dashboard' && (
        <ShipmentDashboard 
          onTrackShipment={(id) => {
            setSelectedShipmentId(id);
            setActiveDesign('tracking');
          }}
        />
      )}
      {activeDesign === 'tracking' && (
        <ShipmentTracking 
          selectedShipmentId={selectedShipmentId}
          onBackToDashboard={() => setActiveDesign('dashboard')}
        />
      )}
      {activeDesign === 'logistics' && (
        <LogisticsManagement 
          onTrackShipment={(id) => {
            setSelectedShipmentId(id);
            setActiveDesign('tracking');
          }}
        />
      )}
    </div>
  );
}
