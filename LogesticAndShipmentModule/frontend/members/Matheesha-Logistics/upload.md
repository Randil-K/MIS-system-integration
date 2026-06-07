# 📤 Git Upload Guide — Matheesha (Logistics Module)

## 🔧 One-Time Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/Randil-K/Shipment-and-Logestic-Managment-System.git
cd Shipment-and-Logestic-Managment-System
```

### Step 2: Create Your Branch
```bash
git checkout -b feature/matheesha-logistics
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
git checkout feature/matheesha-logistics
git pull origin main
```

### After Making Changes
```bash
git status
git add members/Matheesha-Logistics/
git commit -m "feat(logistics): add warehouse CRUD operations"
git push origin feature/matheesha-logistics
```

---

## 📋 Commit Message Format

Examples:
- `feat(logistics): add sorting to fleet table`
- `fix(logistics): fix warehouse capacity calculation`
- `style(logistics): improve metric cards on mobile`

---

## 🔀 Creating a Pull Request

1. Go to: https://github.com/Randil-K/Shipment-and-Logestic-Managment-System
2. Click **"Pull requests"** → **"New pull request"**
3. Set **base**: `main` ← **compare**: `feature/matheesha-logistics`
4. Title: `feat: Improve Logistics & Fleet Management Module`
5. Click **"Create pull request"**

---

## ⚠️ Important: .gitignore & .env

### Files that should NEVER be committed:
- `.env`, `node_modules/`, `backend/target/`, `.idea/`, `.vscode/`

### Safe way to add files:
```bash
git add members/Matheesha-Logistics/
```

### If you accidentally committed a file:
```bash
git rm --cached path/to/file
git commit -m "fix: remove accidentally committed file"
git push origin feature/matheesha-logistics
```

---

## 🆘 Common Git Issues

### Merge conflicts
```bash
git pull origin main
# Fix conflicts, then:
git add .
git commit -m "fix: resolve merge conflicts"
git push origin feature/matheesha-logistics
```

### Wrong branch
```bash
git branch
git checkout feature/matheesha-logistics
```

### Permission denied
- Ask Randil (repo owner) to add you as a collaborator
