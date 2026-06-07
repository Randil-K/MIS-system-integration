# 🔐 Module: Authentication & User Management

**Owner**: Randil  
**Branch**: `feature/randil-auth`

---

## 📋 Module Overview

This module adds **user authentication** to the Shipment & Logistics Management System. Currently the app has NO login/security — anyone can access everything. Your job is to add:

1. **Login Page** — Users enter email + password to access the system
2. **Register Page** — New users can create an account
3. **Auth Context** — React context to manage login state across the app
4. **Protected Routes** — Prevent unauthenticated users from seeing dashboard/tracking/logistics pages
5. **Backend Auth API** — Spring Boot endpoints for login/register
6. **User Entity** — Database table to store user accounts

---

## 📁 Files You Own

### Frontend Files (`frontend/`)

| File | Purpose |
|------|---------|
| `LoginPage.tsx` | Login form UI with email/password fields |
| `RegisterPage.tsx` | Registration form UI with name/email/password fields |
| `AuthContext.tsx` | React Context + Provider to manage auth state (logged in user, token) |
| `ProtectedRoute.tsx` | Wrapper component that redirects to login if user is not authenticated |

### Backend Files (`backend/`)

| File | Purpose |
|------|---------|
| `controller/AuthController.java` | REST endpoints: `POST /api/auth/login`, `POST /api/auth/register` |
| `entity/User.java` | JPA entity for users table (id, name, email, password, role) |
| `repository/UserRepository.java` | Spring Data JPA repository for User entity |
| `config/SecurityConfig.java` | Basic security configuration (can start simple, no JWT needed initially) |

---

## 🔧 What to Modify

- Edit ALL files in this folder — they are skeleton files with TODO comments
- Add proper form validation
- Add error handling (wrong password, duplicate email, etc.)
- Style the login/register pages to match the existing app theme (blue/slate colors)

## ❌ What NOT to Touch

- Do NOT modify any files in `src/` or `backend/` folders directly
- Do NOT change other members' folders
- Do NOT modify `App.tsx` — Kirushajithan will integrate your pages into the router

---

## 🔗 Dependencies on Other Modules

| Module | Dependency |
|--------|------------|
| Kirushajithan (API Service) | Will add your auth API calls to `api.ts` and integrate login/register routes into `App.tsx` |
| Numaya (Backend) | Will add your `User.java` entity to the main backend and update `DbSeeder.java` |

---

## 🧪 Testing Your Module

### Frontend Testing:
1. Open `LoginPage.tsx` and `RegisterPage.tsx` in browser
2. Verify forms render correctly
3. Test form validation (empty fields, invalid email)
4. Test login/register API calls (need backend running)

### Backend Testing:
1. Start the Spring Boot backend
2. Use Postman or curl:
   ```bash
   # Register
   curl -X POST http://localhost:8080/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@test.com","password":"password123"}'
   
   # Login
   curl -X POST http://localhost:8080/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@test.com","password":"password123"}'
   ```
3. Check H2 console for user records: http://localhost:8080/h2-console

---

## 💡 Tips

- Start with the backend first (User entity → Repository → Controller)
- Then build the frontend forms
- Use `localStorage` to store auth token/state for now
- Keep it simple — no JWT required for initial version
- Match the existing app's TailwindCSS styling
