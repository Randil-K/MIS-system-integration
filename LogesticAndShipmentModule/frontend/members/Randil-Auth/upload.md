# 📤 Git Upload Guide — Randil (Auth Module)

## 🔧 One-Time Setup

### Step 1: Clone the Repository (if not already done)
```bash
git clone https://github.com/Randil-K/Shipment-and-Logestic-Managment-System.git
cd Shipment-and-Logestic-Managment-System
```

### Step 2: Create Your Branch
```bash
git checkout -b feature/randil-auth
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
# Make sure you're on your branch
git checkout feature/randil-auth

# Pull latest changes from main
git pull origin main
```

### After Making Changes
```bash
# Check what files you changed
git status

# Add your files (ONLY your module folder)
git add members/Randil-Auth/

# Commit with a descriptive message
git commit -m "feat(auth): add login page with form validation"

# Push to your branch
git push origin feature/randil-auth
```

---

## 📋 Commit Message Format

Use this format: `type(scope): description`

Examples:
- `feat(auth): add login page component`
- `feat(auth): add user entity and repository`
- `fix(auth): fix email validation on register form`
- `style(auth): improve login page styling`

---

## 🔀 Creating a Pull Request

1. Go to: https://github.com/Randil-K/Shipment-and-Logestic-Managment-System
2. Click **"Pull requests"** tab
3. Click **"New pull request"**
4. Set **base**: `main` ← **compare**: `feature/randil-auth`
5. Add title: `feat: Add Authentication Module`
6. Add description of what you did
7. Click **"Create pull request"**

---

## ⚠️ Important: .gitignore & .env

### Files that should NEVER be committed:
- `.env` (your local environment variables)
- `node_modules/` (installed packages)
- `backend/target/` (Java build output)
- `.idea/` or `.vscode/` (IDE settings)

### How .gitignore Works:
The `.gitignore` file in the project root tells Git which files to ignore. It's already set up — you don't need to modify it. Just make sure:
- You created `.env` from `.env.example`
- You NEVER use `git add .` (this might add unwanted files)
- Always use `git add members/Randil-Auth/` to add only your folder

### If you accidentally committed a file:
```bash
# Remove it from Git tracking (keeps local file)
git rm --cached path/to/file
git commit -m "fix: remove accidentally committed file"
git push origin feature/randil-auth
```

---

## 🆘 Common Git Issues

### "Permission denied" when pushing
```bash
# Make sure you have access to the repo
# Ask Randil (repo owner) to add you as a collaborator
```

### Merge conflicts
```bash
# Pull latest main
git pull origin main

# If conflicts appear, open the conflicted files
# Look for <<<<<<< and >>>>>>> markers
# Fix the conflicts, then:
git add .
git commit -m "fix: resolve merge conflicts"
git push origin feature/randil-auth
```

### Wrong branch
```bash
# Check current branch
git branch

# Switch to your branch
git checkout feature/randil-auth
```
