# 📊 Module: Dashboard Overview

**Owner**: Udara  
**Branch**: `feature/udara-dashboard`

---

## 📋 Module Overview

This module handles the **main Dashboard page** of the Shipment & Logistics Management System. The dashboard provides an at-a-glance overview of all shipment operations including:

1. **KPI Cards** — Active Shipments, On-Time Delivery %, Delayed Shipments, Fleet Utilization %
2. **Shipment Volume Chart** — Bar chart showing monthly shipment volumes (last 5 months)
3. **Delivery Status Pie Chart** — Donut chart showing On Time / Delayed / In Transit breakdown
4. **Recent Shipments Table** — List of recent shipments with status, ETA, and progress bar

---

## 📁 Files You Own

### Frontend Files (`frontend/`)

| File | Purpose |
|------|---------|
| `ShipmentDashboard.tsx` | Main dashboard page component — KPI cards, charts, shipment table |

### Backend Files (`backend/`)

| File | Purpose |
|------|---------|
| `controller/DashboardController.java` | REST API at `/api/dashboard` with 4 endpoints: `/kpis`, `/shipment-volume`, `/delivery-status`, `/recent-shipments` |
| `dto/DashboardKpisDto.java` | Data Transfer Object for dashboard KPI data |
| `dto/DeliveryStatusDto.java` | DTO for delivery status pie chart data |
| `dto/ShipmentVolumeDto.java` | DTO for monthly shipment volume bar chart data |

---

## 🔧 What to Modify

- **Improve the KPI cards** — Currently shows hardcoded % changes (+12%, +8%, etc.). Make these dynamic
- **Enhance the charts** — Add more interactivity, tooltips, date range filters
- **Add search/filter** to the Recent Shipments table
- **Make the dashboard responsive** — Test on mobile screens
- **Replace hardcoded values in DashboardController.java** — The `onTimeDeliveryPercent` is hardcoded as 87.3. Calculate it dynamically from actual shipment data
- **Add pagination** to the recent shipments table

## ❌ What NOT to Touch

- Do NOT modify any files in `src/` or `backend/` directly
- Do NOT change other members' folders
- Do NOT modify `api.ts` — Kirushajithan owns that file

---

## 🔗 Dependencies on Other Modules

| Module | Dependency |
|--------|------------|
| Kirushajithan (API Service) | Provides the `api.ts` client that your component uses to fetch data |
| Numaya (Backend) | Provides the database entities (Shipment) that your controller queries |

---

## 🧪 Testing Your Module

### Frontend:
1. Run `npm run dev` from the project root
2. Open http://localhost:5173
3. The Dashboard tab should show your component
4. Verify KPI cards, charts, and table render correctly

### Backend:
1. Start the backend (run-backend.ps1)
2. Test endpoints in browser or Postman:
   - GET http://localhost:8080/api/dashboard/kpis
   - GET http://localhost:8080/api/dashboard/shipment-volume
   - GET http://localhost:8080/api/dashboard/delivery-status
   - GET http://localhost:8080/api/dashboard/recent-shipments

---

## 💡 Tips

- The component uses `recharts` library for charts — check docs at https://recharts.org
- Lucide React is used for icons — browse at https://lucide.dev
- The existing code fetches from backend on mount using `useEffect`
- State management uses React's `useState` hook
