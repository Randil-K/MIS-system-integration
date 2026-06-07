# 🚛 Module: Logistics & Fleet Management

**Owner**: Matheesha  
**Branch**: `feature/matheesha-logistics`

---

## 📋 Module Overview

This module manages the **Logistics & Fleet Management** page. It provides real-time monitoring of warehouses and fleet vehicles:

1. **Overview Metrics** — Total Warehouses, Active Fleet count, Fleet Utilization %, Fuel Efficiency (colorful gradient cards)
2. **Warehouse Capacity** — Card list showing each warehouse's capacity utilization with progress bars
3. **Fleet Utilization Chart** — Area chart showing weekly fleet utilization trends
4. **Active Fleet Table** — Table of all fleet vehicles with driver, route, location, status, load %, and ETA
5. **Create Shipment Modal** — Form to create a new shipment with product, quantity, destination, and recipient details

---

## 📁 Files You Own

### Frontend Files (`frontend/`)

| File | Purpose |
|------|---------|
| `LogisticsManagement.tsx` | Full logistics page — metrics cards, warehouse list, fleet chart, fleet table, create shipment modal |

### Backend Files (`backend/`)

| File | Purpose |
|------|---------|
| `controller/LogisticsController.java` | REST API at `/api/logistics` — KPIs, warehouses, vehicles, fleet utilization |
| `dto/LogisticsKpisDto.java` | DTO for logistics overview metrics |
| `entity/Warehouse.java` | JPA entity for warehouses (id, name, location, capacity, current, status) |
| `entity/FleetVehicle.java` | JPA entity for fleet vehicles (id, driver, route, status, load%, ETA) |
| `entity/FleetUtilization.java` | JPA entity for daily fleet utilization percentages |
| `repository/WarehouseRepository.java` | Data access for Warehouse entity |
| `repository/FleetVehicleRepository.java` | Data access for FleetVehicle entity |
| `repository/FleetUtilizationRepository.java` | Data access for FleetUtilization entity |

---

## 🔧 What to Modify

- **Replace hardcoded KPIs** — `LogisticsController` hardcodes fleet utilization (78.5%) and fuel efficiency (24.8 mpg). Calculate dynamically
- **Add warehouse CRUD** — Currently read-only. Add ability to create, update, delete warehouses
- **Add vehicle assignment** — Ability to assign drivers to vehicles
- **Improve search** — The fleet table has search — enhance it with status filters
- **Add sorting** to the fleet table (by load %, status, ETA)
- **Improve the Create Shipment form** — Add more fields, warehouse selection
- **Add warehouse map** — Show warehouses on an interactive map using lat/lng coordinates

## ❌ What NOT to Touch

- Do NOT modify any files in `src/` or `backend/` directly
- Do NOT change other members' folders

---

## 🔗 Dependencies on Other Modules

| Module | Dependency |
|--------|------------|
| Kirushajithan (API Service) | Provides `api.ts` with logistics API functions |
| Numaya (Backend) | Provides DbSeeder that populates warehouse and fleet data |
| Chamod (Tracking) | Create Shipment modal navigates to tracking page after creation |

---

## 🧪 Testing Your Module

### Frontend:
1. Run `npm run dev`
2. Click the "Logistics Management" tab
3. Verify metrics, warehouse list, fleet chart and table render
4. Test "New Shipment" button and form submission
5. Test fleet search functionality

### Backend:
1. Start the backend
2. Test endpoints:
   - GET http://localhost:8080/api/logistics/kpis
   - GET http://localhost:8080/api/logistics/warehouses
   - GET http://localhost:8080/api/logistics/vehicles
   - GET http://localhost:8080/api/logistics/fleet-utilization

---

## 💡 Tips

- The fleet utilization chart uses `recharts` AreaChart with gradient fill
- Warehouse cards change color when near capacity (>85%) — orange instead of blue
- The create shipment modal calls `api.createShipment()` and navigates to tracking on success
- Fleet vehicles have statuses: "In Transit", "Loading", "Delayed"
