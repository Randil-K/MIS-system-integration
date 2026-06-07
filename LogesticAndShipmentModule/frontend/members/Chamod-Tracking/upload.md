# 📤 Git Upload Guide — Chamod (Tracking Module)

## 🔧 One-Time Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/Randil-K/Shipment-and-Logestic-Managment-System.git
cd Shipment-and-Logestic-Managment-System
```

### Step 2: Create Your Branch
```bash
git checkout -b feature/chamod-tracking
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
git checkout feature/chamod-tracking
git pull origin main
```

### After Making Changes
```bash
git status
git add members/Chamod-Tracking/
git commit -m "feat(tracking): add real-time tracking updates"
git push origin feature/chamod-tracking
```

---

## 📋 Commit Message Format

Examples:
- `feat(tracking): add map view for shipment location`
- `fix(tracking): fix timeline rendering for delayed shipments`
- `style(tracking): improve status banner gradient`

---

## 🔀 Creating a Pull Request

1. Go to: https://github.com/Randil-K/Shipment-and-Logestic-Managment-System
2. Click **"Pull requests"** → **"New pull request"**
3. Set **base**: `main` ← **compare**: `feature/chamod-tracking`
4. Title: `feat: Improve Shipment Tracking Module`
5. Click **"Create pull request"**

---

## ⚠️ Important: .gitignore & .env

### Files that should NEVER be committed:
- `.env`, `node_modules/`, `backend/target/`, `.idea/`, `.vscode/`

### Safe way to add files:
```bash
# Always specify YOUR folder only
git add members/Chamod-Tracking/
```

### If you accidentally committed a file:
```bash
git rm --cached path/to/file
git commit -m "fix: remove accidentally committed file"
git push origin feature/chamod-tracking
```

---

## 🆘 Common Git Issues

### Merge conflicts
```bash
git pull origin main
# Fix conflicts (look for <<<<<<< markers)
git add .
git commit -m "fix: resolve merge conflicts"
git push origin feature/chamod-tracking
```

### Wrong branch
```bash
git branch
git checkout feature/chamod-tracking
```

### Permission denied
- Ask Randil (repo owner) to add you as a collaborator on GitHub
