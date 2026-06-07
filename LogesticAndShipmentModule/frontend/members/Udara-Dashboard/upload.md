# 📤 Git Upload Guide — Udara (Dashboard Module)

## 🔧 One-Time Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/Randil-K/Shipment-and-Logestic-Managment-System.git
cd Shipment-and-Logestic-Managment-System
```

### Step 2: Create Your Branch
```bash
git checkout -b feature/udara-dashboard
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
git checkout feature/udara-dashboard
git pull origin main
```

### After Making Changes
```bash
git status
git add members/Udara-Dashboard/
git commit -m "feat(dashboard): add search filter to shipments table"
git push origin feature/udara-dashboard
```

---

## 📋 Commit Message Format

Use this format: `type(scope): description`

Examples:
- `feat(dashboard): add date range filter to charts`
- `fix(dashboard): fix KPI calculation for on-time delivery`
- `style(dashboard): improve mobile responsiveness`

---

## 🔀 Creating a Pull Request

1. Go to: https://github.com/Randil-K/Shipment-and-Logestic-Managment-System
2. Click **"Pull requests"** → **"New pull request"**
3. Set **base**: `main` ← **compare**: `feature/udara-dashboard`
4. Title: `feat: Improve Dashboard Module`
5. Describe your changes
6. Click **"Create pull request"**

---

## ⚠️ Important: .gitignore & .env

### Files that should NEVER be committed:
- `.env` (your local environment variables)
- `node_modules/` (installed packages)
- `backend/target/` (Java build output)
- `.idea/` or `.vscode/` (IDE settings)

### How .gitignore Works:
The `.gitignore` file tells Git to ignore certain files. It's already configured. Just:
- Create `.env` from `.env.example`
- Always use `git add members/Udara-Dashboard/` (not `git add .`)

### If you accidentally committed a file:
```bash
git rm --cached path/to/file
git commit -m "fix: remove accidentally committed file"
git push origin feature/udara-dashboard
```

---

## 🆘 Common Git Issues

### Merge conflicts
```bash
git pull origin main
# Fix conflicts in files (look for <<<<<<< markers)
git add .
git commit -m "fix: resolve merge conflicts"
git push origin feature/udara-dashboard
```

### Wrong branch
```bash
git branch              # Check current branch
git checkout feature/udara-dashboard   # Switch to your branch
```

### Permission denied
- Ask Randil (repo owner) to add you as a collaborator on GitHub
