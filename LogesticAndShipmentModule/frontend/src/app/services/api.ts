const API_BASE_URL = 'http://localhost:8080/api';

export interface Shipment {
  id: string;
  trackingNumber: string;
  product: string;
  destination: string;
  status: string;
  eta: string;
  progress: number;
  quantity?: number;
  weight?: string;
  dimensions?: string;
  carrier?: string;
  service?: string;
  origin?: string;
  estimatedDelivery?: string;
  senderName?: string;
  senderPhone?: string;
  senderEmail?: string;
  recipientName?: string;
  recipientPhone?: string;
  recipientEmail?: string;
  recipientAddress?: string;
}

export interface TrackingEvent {
  id?: number;
  shipmentId: string;
  status: string;
  location: string;
  timestamp: string;
  description: string;
  completed: boolean;
  iconName: string;
}

export interface TrackingDetails {
  id: string;
  trackingNumber: string;
  product: string;
  quantity: number;
  weight: string;
  dimensions: string;
  carrier: string;
  service: string;
  origin: string;
  destination: string;
  estimatedDelivery: string;
  status: string;
  progress: number;
  sender: {
    name: string;
    phone: string;
    email: string;
  };
  recipient: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  events: TrackingEvent[];
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
  current: number;
  status: string;
  activeShipments: number;
  latitude: number;
  longitude: number;
}

export interface FleetVehicle {
  id: string;
  driver: string;
  route: string;
  status: string;
  loadPercent: number; // mapped from backend loadPercent
  eta: string;
  location: string;
}

export interface FleetUtilization {
  day: string;
  utilization: number;
}

export interface DashboardKpis {
  activeShipments: number;
  onTimeDeliveryPercent: number;
  delayedShipments: number;
  fleetUtilizationPercent: number;
}

export interface LogisticsKpis {
  totalWarehouses: number;
  activeFleet: number;
  fleetUtilizationPercent: number;
  fuelEfficiencyMpg: number;
}

export interface ShipmentVolume {
  month: string;
  shipments: number;
}

export interface DeliveryStatus {
  name: string;
  value: number;
  color: string;
}

export const api = {
  // Dashboard Endpoints
  async getDashboardKpis(): Promise<DashboardKpis> {
    const res = await fetch(`${API_BASE_URL}/dashboard/kpis`);
    if (!res.ok) throw new Error('Failed to fetch dashboard KPIs');
    return res.json();
  },

  async getShipmentVolume(): Promise<ShipmentVolume[]> {
    const res = await fetch(`${API_BASE_URL}/dashboard/shipment-volume`);
    if (!res.ok) throw new Error('Failed to fetch shipment volume data');
    return res.json();
  },

  async getDeliveryStatus(): Promise<DeliveryStatus[]> {
    const res = await fetch(`${API_BASE_URL}/dashboard/delivery-status`);
    if (!res.ok) throw new Error('Failed to fetch delivery status data');
    return res.json();
  },

  async getRecentShipments(): Promise<Shipment[]> {
    const res = await fetch(`${API_BASE_URL}/dashboard/recent-shipments`);
    if (!res.ok) throw new Error('Failed to fetch recent shipments');
    return res.json();
  },

  // Tracking Endpoints
  async getTrackingDetails(id: string): Promise<TrackingDetails> {
    const res = await fetch(`${API_BASE_URL}/shipments/${id}/tracking`);
    if (!res.ok) throw new Error(`Failed to fetch tracking details for ${id}`);
    return res.json();
  },

  // Logistics Endpoints
  async getLogisticsKpis(): Promise<LogisticsKpis> {
    const res = await fetch(`${API_BASE_URL}/logistics/kpis`);
    if (!res.ok) throw new Error('Failed to fetch logistics KPIs');
    return res.json();
  },

  async getWarehouses(): Promise<Warehouse[]> {
    const res = await fetch(`${API_BASE_URL}/logistics/warehouses`);
    if (!res.ok) throw new Error('Failed to fetch warehouses');
    return res.json();
  },

  async getVehicles(): Promise<FleetVehicle[]> {
    const res = await fetch(`${API_BASE_URL}/logistics/vehicles`);
    if (!res.ok) throw new Error('Failed to fetch vehicles');
    return res.json();
  },

  async getFleetUtilization(): Promise<FleetUtilization[]> {
    const res = await fetch(`${API_BASE_URL}/logistics/fleet-utilization`);
    if (!res.ok) throw new Error('Failed to fetch fleet utilization');
    return res.json();
  },

  // Mutation Endpoints
  async createShipment(shipment: Partial<Shipment>): Promise<Shipment> {
    const res = await fetch(`${API_BASE_URL}/shipments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shipment),
    });
    if (!res.ok) throw new Error('Failed to create shipment');
    return res.json();
  },

  async downloadLabel(id: string): Promise<string> {
    const res = await fetch(`${API_BASE_URL}/shipments/${id}/action/download-label`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to download label');
    return res.text();
  },

  async reportIssue(id: string): Promise<Shipment> {
    const res = await fetch(`${API_BASE_URL}/shipments/${id}/action/report-issue`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to report issue');
    return res.json();
  },
};
