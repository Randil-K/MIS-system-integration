# 🚚 Shipment & Logistics Management System — Team Guide

## 📋 Project Overview

This is a full-stack Shipment & Logistics Management System built with:
- **Frontend**: React + Vite + TailwindCSS + shadcn/ui
- **Backend**: Spring Boot 3.3 + JPA + H2 Database

The project is divided into **6 modules**, one per team member.

---

## 👥 Team Members & Modules

| Member | Branch Name | Module | Folder |
|--------|------------|--------|--------|
| Randil | `feature/randil-auth` | Authentication & User Management | `members/Randil-Auth/` |
| Udara | `feature/udara-dashboard` | Dashboard Overview | `members/Udara-Dashboard/` |
| Chamod | `feature/chamod-tracking` | Shipment Tracking | `members/Chamod-Tracking/` |
| Matheesha | `feature/matheesha-logistics` | Logistics & Fleet Management | `members/Matheesha-Logistics/` |
| Kirushajithan | `feature/kirushajithan-api` | API Service Layer & Shared Components | `members/Kirushajithan-ApiService/` |
| Numaya | `feature/numaya-backend` | Backend Infrastructure | `members/Numaya-Backend/` |

---

## 🚀 How to Set Up (Everyone)

### Step 1: Clone the Repository
```bash
git clone https://github.com/Randil-K/Shipment-and-Logestic-Managment-System.git
cd Shipment-and-Logestic-Managment-System
```

### Step 2: Set Up Environment
```bash
copy .env.example .env
```
Edit `.env` with your local values (usually defaults are fine).

### Step 3: Install Frontend Dependencies
```bash
npm install
```

### Step 4: Run Frontend
```bash
npm run dev
```
Frontend runs at: http://localhost:5173

### Step 5: Run Backend
```bash
cd backend
.\run-backend.ps1
```
Backend runs at: http://localhost:8080
H2 Console: http://localhost:8080/h2-console

---

## 📁 Project Structure

```
Code/
├── src/                    ← Frontend source (React)
│   ├── app/
│   │   ├── App.tsx         ← Main app with navigation
│   │   ├── components/     ← Page components
│   │   │   ├── ShipmentDashboard.tsx    (Udara)
│   │   │   ├── ShipmentTracking.tsx     (Chamod)
│   │   │   └── LogisticsManagement.tsx  (Matheesha)
│   │   └── services/
│   │       └── api.ts      ← API client (Kirushajithan)
│   └── styles/
├── backend/                ← Backend source (Spring Boot)
│   └── src/main/java/com/logistics/backend/
│       ├── controller/     ← REST API endpoints
│       ├── entity/         ← Database entities
│       ├── repository/     ← Data access layer
│       ├── dto/            ← Data transfer objects
│       └── config/         ← Configuration
├── members/                ← Member working directories
│   ├── Randil-Auth/
│   ├── Udara-Dashboard/
│   ├── Chamod-Tracking/
│   ├── Matheesha-Logistics/
│   ├── Kirushajithan-ApiService/
│   └── Numaya-Backend/
├── .gitignore
├── .env.example
└── TEAM_README.md
```

---

## 🔄 Git Workflow

### Each Member:
1. Create your branch: `git checkout -b feature/YOUR-BRANCH`
2. Work ONLY in your `members/YOUR-FOLDER/`
3. Commit & push to your branch
4. Create a Pull Request to merge into `main`

### Integration (After Everyone Pushes):
1. Clone the repo fresh
2. All member folders will be present
3. Copy finished files from `members/` folders back into `src/` and `backend/`
4. Run `npm install` → `npm run dev` (frontend)
5. Run backend via Maven
6. Everything works!

---

## ⚠️ Important Rules

1. **NEVER modify original files** in `src/` or `backend/` directly
2. Work ONLY in your assigned `members/` folder
3. Always pull latest `main` before creating your branch
4. NEVER commit `.env` files — only `.env.example`
5. NEVER commit `node_modules/` or `target/` folders
6. Read your `explain.md` before starting
7. Follow your `upload.md` for Git instructions

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend Framework | React 18 |
| Build Tool | Vite 6 |
| CSS | TailwindCSS 4 |
| UI Components | shadcn/ui (Radix) |
| Charts | Recharts |
| Icons | Lucide React |
| Backend | Spring Boot 3.3 |
| Database | H2 (In-Memory) |
| ORM | Spring Data JPA |
| Java | 21 |
