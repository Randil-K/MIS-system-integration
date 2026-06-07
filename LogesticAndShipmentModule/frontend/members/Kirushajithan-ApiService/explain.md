# 🔌 Module: API Service Layer & Shared Components

**Owner**: Kirushajithan  
**Branch**: `feature/kirushajithan-api`

---

## 📋 Module Overview

This is the **glue module** that connects the frontend to the backend. You own:

1. **API Client (`api.ts`)** — The centralized API client that ALL other frontend modules use to talk to the backend
2. **App Router (`App.tsx`)** — The main application component with navigation tabs
3. **TypeScript Interfaces** — All shared data types (Shipment, Warehouse, FleetVehicle, etc.)
4. **Shared Utilities** — Helper functions used across the app

This is a **critical module** — every other frontend module depends on your API client!

---

## 📁 Files You Own

### Frontend Files (`frontend/`)

| File | Purpose |
|------|---------|
| `api.ts` | **Central API client** — All fetch calls to the backend. Contains TypeScript interfaces for all data types + API functions |
| `App.tsx` | **Main application** — Navigation tabs (Dashboard, Tracking, Logistics), state management for active page |

### Shared Files (`shared/`)

| File | Purpose |
|------|---------|
| `utils.ts` | Utility function `cn()` for merging Tailwind CSS class names |
| `use-mobile.ts` | React hook to detect mobile screen size |
| `ImageWithFallback.tsx` | Image component with error fallback |

---

## 🔧 What to Modify

### api.ts:
- **Add auth endpoints** — `login()`, `register()` functions (coordinate with Randil)
- **Add error handling middleware** — Centralized error handling for all API calls
- **Add request interceptors** — Automatically attach auth token to all requests
- **Use environment variables** — Replace hardcoded `http://localhost:8080/api` with env variable
- **Add loading state management** — Consider using a request queue or caching

### App.tsx:
- **Add Login/Register routes** — Integrate Randil's auth pages into navigation
- **Add sidebar navigation** — Replace the current tab navigation with a sidebar
- **Add user profile dropdown** — Show logged-in user info with logout button
- **Add a 404/Not Found page**
- **Add breadcrumb navigation**

### Shared:
- **Add more utility functions** as needed by other modules
- **Add date formatting helpers** for consistent date display
- **Add number formatting helpers** (currency, percentages, etc.)

## ❌ What NOT to Touch

- Do NOT modify files in `src/` or `backend/` directly
- Do NOT modify other members' page components (Dashboard, Tracking, Logistics)

---

## 🔗 Dependencies on Other Modules

| Module | Dependency |
|--------|------------|
| Randil (Auth) | You integrate his LoginPage and RegisterPage into App.tsx navigation |
| Udara (Dashboard) | Dashboard component is imported and rendered in App.tsx |
| Chamod (Tracking) | Tracking component is imported and rendered in App.tsx |
| Matheesha (Logistics) | Logistics component is imported and rendered in App.tsx |
| Numaya (Backend) | All your API endpoints must match the backend URLs |

> ⚠️ **You are the integration point!** Coordinate with all team members to ensure API endpoints match.

---

## 🧪 Testing Your Module

### api.ts Testing:
1. Start the backend
2. Open browser console (F12)
3. Test each API function manually:
   ```javascript
   // In browser console
   fetch('http://localhost:8080/api/dashboard/kpis').then(r => r.json()).then(console.log)
   ```

### App.tsx Testing:
1. Run `npm run dev`
2. Verify all navigation tabs work
3. Verify page switching works correctly
4. Verify state is preserved when switching tabs

---

## 💡 Tips

- The `api.ts` file exports an `api` object with all API methods
- Each API method returns a typed Promise (e.g., `Promise<DashboardKpis>`)
- The App.tsx uses `useState` to manage which page is active
- When adding auth, you'll wrap the app with `<AuthProvider>` and use `<ProtectedRoute>`
- Consider using `axios` instead of `fetch` for better error handling and interceptors
