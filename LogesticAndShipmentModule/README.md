# 🚚 Logistics & Shipment Management Module

A full-stack module for managing shipments, fleet vehicles, warehouses, and real-time logistics tracking — built with **Spring Boot** (backend) and **React + Vite** (frontend), containerized with **Docker**.

---

## 📋 Project Description

This module is part of a larger **Supply Chain Management (SCM)** integrated system. It provides:

- 📦 **Shipment Dashboard** — KPIs, monthly volume chart, delivery status breakdown
- 🔍 **Shipment Tracking** — Real-time tracking events timeline, sender/recipient details
- 🏭 **Logistics Management** — Warehouse capacity, fleet vehicle status, fleet utilization chart

The backend integrates with the **Order & Billing module** (port `8082`) to automatically sync shipment status back to orders.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TailwindCSS + shadcn/ui |
| Backend | Spring Boot 3.3 (Java 21) |
| Database | MySQL 8.0 |
| ORM | Spring Data JPA |
| Containerization | Docker + Docker Compose |

---

## 🚀 Running with Docker (Recommended)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### Step 1 — Configure environment
```bash
# Copy the example env file
copy .env.example .env
```
The default `.env` values work out of the box. No changes needed for local demo.

### Step 2 — Build and Start all services
```bash
cd LogesticAndShipmentModule
docker-compose up --build
```

This will start **3 containers**:
| Container | Description | Port |
|-----------|-------------|------|
| `logistics-db` | MySQL 8.0 database | `3306` |
| `logistics-backend` | Spring Boot REST API | `8080` |
| `logistics-frontend` | React app served by Nginx | `5173` |

### Step 3 — Open the Application
```
http://localhost:5173
```

### Stop the services
```bash
docker-compose down
```

### Stop and remove all data (clean slate)
```bash
docker-compose down -v
```

---

## 🔧 Running Locally (Without Docker)

### Prerequisites
- Java 21+
- Maven 3.9+
- Node.js 20+
- MySQL 8.0 (via XAMPP or standalone)

### Backend
```bash
cd backend
# Create the database first in MySQL:
# CREATE DATABASE logistics_db;

mvn clean spring-boot:run
# Backend runs at: http://localhost:8080
```

### Frontend
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
# Frontend runs at: http://localhost:5173
```

---

## 🌐 API Endpoints

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/kpis` | Get KPI metrics (active, delayed, on-time %) |
| GET | `/api/dashboard/shipment-volume` | Monthly shipment volume data |
| GET | `/api/dashboard/delivery-status` | Delivery status breakdown |
| GET | `/api/dashboard/recent-shipments` | List of recent non-historical shipments |

### Shipments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/shipments` | Get all shipments |
| POST | `/api/shipments` | Create a new shipment |
| GET | `/api/shipments/{id}` | Get shipment by ID or legacy string ID |
| PUT | `/api/shipments/{id}` | Update shipment details |
| DELETE | `/api/shipments/{id}` | Delete shipment |
| PUT | `/api/shipments/{id}/status` | Update shipment status |
| GET | `/api/shipments/{id}/tracking` | Get full tracking details |
| GET | `/api/shipments/{id}/events` | Get tracking events for shipment |
| POST | `/api/shipments/{id}/events` | Add a tracking event manually |
| GET | `/api/shipments/tracking/{trackingNumber}` | Find shipment by tracking number |
| GET | `/api/shipments/order/{orderId}` | Get shipments by Order ID |
| GET | `/api/shipments/statistics` | Shipment count statistics |

### Logistics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/logistics/kpis` | Fleet & warehouse KPIs |
| GET | `/api/logistics/warehouses` | List all warehouses |
| POST | `/api/logistics/warehouses` | Create a warehouse |
| PUT | `/api/logistics/warehouses/{id}` | Update a warehouse |
| DELETE | `/api/logistics/warehouses/{id}` | Delete a warehouse |
| GET | `/api/logistics/vehicles` | List all fleet vehicles |
| POST | `/api/logistics/vehicles` | Add a fleet vehicle |
| PUT | `/api/logistics/vehicles/{id}` | Update a fleet vehicle |
| DELETE | `/api/logistics/vehicles/{id}` | Remove a fleet vehicle |
| GET | `/api/logistics/fleet-utilization` | Weekly fleet utilization |

---

## 🔗 Integration Details

This module integrates with the **Order & Billing Module** (`http://localhost:8082`):
- When a shipment status is updated to `DELIVERED`, the system calls the Order service to sync delivery status.
- Configuration: `integration.order-service.url` in `application.properties`.

In Docker, this URL is passed via the environment variable:
```
INTEGRATION_ORDER_SERVICE_URL=http://host.docker.internal:8082
```

---

## 📁 Project Structure

```
LogesticAndShipmentModule/
├── backend/                    ← Spring Boot backend
│   ├── Dockerfile
│   └── src/main/java/com/logistics/backend/
│       ├── controller/         ← REST controllers
│       ├── entity/             ← JPA entities
│       ├── repository/         ← Data access layer
│       ├── service/            ← Business logic
│       ├── dto/                ← Data transfer objects
│       ├── config/             ← DB seeder & CORS config
│       └── exception/          ← Global error handling
├── frontend/                   ← React + Vite frontend
│   ├── Dockerfile
│   └── src/app/
│       ├── App.tsx             ← Main app with tab navigation
│       ├── components/         ← Page components
│       │   ├── ShipmentDashboard.tsx
│       │   ├── ShipmentTracking.tsx
│       │   └── LogisticsManagement.tsx
│       └── services/
│           └── api.ts          ← REST API client
├── db/
│   └── init.sql                ← Database schema initialization
├── docker-compose.yml          ← Multi-service Docker setup
├── .env                        ← Local environment variables
├── .env.example                ← Environment template
└── README.md
```

---

## 🔑 Port Summary

| Service | Port |
|---------|------|
| Frontend (React) | `5173` |
| Backend (Spring Boot) | `8080` |
| Database (MySQL) | `3306` |

---

## 📦 Sample Data

On first startup, the backend automatically seeds the database with:
- **4 Warehouses** (San Francisco, Chicago, New York, Dallas)
- **5 Fleet Vehicles** (TRK-101 through TRK-105)
- **5 Active Shipments** with full tracking event history
- **Historical shipment data** (Jan–May) for dashboard charts