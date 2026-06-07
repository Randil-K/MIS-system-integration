# 📦 Module: Shipment Tracking

**Owner**: Chamod  
**Branch**: `feature/chamod-tracking`

---

## 📋 Module Overview

This module handles **individual shipment tracking** — when a user clicks on a shipment from the Dashboard, they see the detailed tracking page. This module includes:

1. **Status Banner** — Gradient banner showing current shipment status (In Transit / Delivered / Delayed)
2. **Tracking Timeline** — Vertical timeline of all tracking events with icons, timestamps, locations
3. **Package Details** — Side panel showing product info, weight, dimensions, carrier
4. **Contact Information** — Sender and recipient details with phone/email
5. **Actions** — Download shipping label, Report issue buttons

---

## 📁 Files You Own

### Frontend Files (`frontend/`)

| File | Purpose |
|------|---------|
| `ShipmentTracking.tsx` | Full tracking page — timeline, package details, contacts, actions |

### Backend Files (`backend/`)

| File | Purpose |
|------|---------|
| `controller/ShipmentController.java` | REST API at `/api/shipments` — CRUD operations, tracking details, download label, report issue |
| `dto/TrackingDetailsDto.java` | DTO combining shipment info + sender/recipient + tracking events |
| `entity/TrackingEvent.java` | JPA entity for tracking timeline events |
| `repository/TrackingEventRepository.java` | Data access for tracking events |

---

## 🔧 What to Modify

- **Add real-time tracking updates** — Auto-refresh tracking data periodically
- **Improve timeline UI** — Add animation when new events appear
- **Add map integration** — Show shipment location on a map (optional, can use Leaflet.js)
- **Enhance label download** — Currently downloads a text file. Make it a proper PDF label
- **Add shipment status notifications** — Show toast/alert when status changes
- **Improve the Report Issue flow** — Add issue categories and description field

## ❌ What NOT to Touch

- Do NOT modify any files in `src/` or `backend/` directly
- Do NOT change other members' folders
- Do NOT modify `api.ts` — Kirushajithan owns that file

---

## 🔗 Dependencies on Other Modules

| Module | Dependency |
|--------|------------|
| Kirushajithan (API Service) | Provides `api.ts` with `getTrackingDetails()`, `downloadLabel()`, `reportIssue()` functions |
| Numaya (Backend) | Provides the `Shipment` entity that ShipmentController queries |
| Udara (Dashboard) | Dashboard's "Track" button navigates to your tracking page |

---

## 🧪 Testing Your Module

### Frontend:
1. Run `npm run dev`
2. Click on any shipment in the Dashboard to navigate to tracking
3. Verify timeline, package details, and actions work correctly

### Backend:
1. Start the backend
2. Test endpoints:
   - GET http://localhost:8080/api/shipments/SH-2026-1847/tracking
   - POST http://localhost:8080/api/shipments/SH-2026-1847/action/download-label
   - POST http://localhost:8080/api/shipments/SH-2026-1847/action/report-issue

### Available Shipment IDs for testing:
- SH-2026-1847, SH-2026-1848, SH-2026-1849, SH-2026-1850, SH-2026-1851

---

## 💡 Tips

- The `iconMap` in ShipmentTracking.tsx maps backend icon names to Lucide icons
- Tracking events have a `completed` boolean that controls the timeline line color
- The Download Label currently generates a text file — you can upgrade to PDF using jsPDF
- The Report Issue endpoint marks the shipment as "Delayed" and adds a tracking event
