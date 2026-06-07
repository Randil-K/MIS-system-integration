# 📤 Git Upload Guide — Kirushajithan (API Service Module)

## 🔧 One-Time Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/Randil-K/Shipment-and-Logestic-Managment-System.git
cd Shipment-and-Logestic-Managment-System
```

### Step 2: Create Your Branch
```bash
git checkout -b feature/kirushajithan-api
```

### Step 3: Set Up Environment
```bash
copy .env.example .env
```
> ⚠️ NEVER commit the `.env` file! It's already in `.gitignore`.

---

## 📝 Daily Workflow

### Before Starting Work
```bash
git checkout feature/kirushajithan-api
git pull origin main
```

### After Making Changes
```bash
git status
git add members/Kirushajithan-ApiService/
git commit -m "feat(api): add auth endpoints to api client"
git push origin feature/kirushajithan-api
```

---

## 📋 Commit Message Format

Examples:
- `feat(api): add request interceptor for auth token`
- `feat(api): add sidebar navigation to App.tsx`
- `fix(api): fix error handling in API client`
- `refactor(api): use environment variable for API URL`

---

## 🔀 Creating a Pull Request

1. Go to: https://github.com/Randil-K/Shipment-and-Logestic-Managment-System
2. Click **"Pull requests"** → **"New pull request"**
3. Set **base**: `main` ← **compare**: `feature/kirushajithan-api`
4. Title: `feat: Improve API Service Layer & App Navigation`
5. Click **"Create pull request"**

---

## ⚠️ Important: .gitignore & .env

### Files that should NEVER be committed:
- `.env`, `node_modules/`, `backend/target/`, `.idea/`, `.vscode/`

### Safe way to add files:
```bash
git add members/Kirushajithan-ApiService/
```

### If you accidentally committed a file:
```bash
git rm --cached path/to/file
git commit -m "fix: remove accidentally committed file"
git push origin feature/kirushajithan-api
```

---

## 🆘 Common Git Issues

### Merge conflicts
```bash
git pull origin main
# Fix conflicts, then:
git add .
git commit -m "fix: resolve merge conflicts"
git push origin feature/kirushajithan-api
```

### Wrong branch
```bash
git branch
git checkout feature/kirushajithan-api
```

### Permission denied
- Ask Randil (repo owner) to add you as a collaborator
