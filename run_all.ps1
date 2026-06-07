# SCM System Centralized Startup Script
Set-Location -Path $PSScriptRoot

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "STARTING SUPPLY CHAIN MANAGEMENT SYSTEM" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Check and start MySQL if not already running
$mysqlCheck = Test-NetConnection -ComputerName localhost -Port 3306 -WarningAction SilentlyContinue
if ($mysqlCheck.TcpTestSucceeded -ne $true) {
    Write-Host "MySQL is not running. Attempting to start XAMPP MySQL..." -ForegroundColor Yellow
    if (Test-Path "C:\xampp\mysql\bin\mysqld.exe") {
        Start-Process -FilePath "C:\xampp\mysql\bin\mysqld.exe" -ArgumentList "--defaults-file=C:\xampp\mysql\bin\my.ini" -WindowStyle Hidden
        Start-Sleep -Seconds 3
        Write-Host "XAMPP MySQL started successfully!" -ForegroundColor Green
    } else {
        Write-Host "Warning: C:\xampp\mysql\bin\mysqld.exe not found. Please ensure MySQL is running on port 3306." -ForegroundColor Red
    }
} else {
    Write-Host "MySQL is already running on port 3306!" -ForegroundColor Green
}

Write-Host ""
Write-Host "Starting Backends in separate windows..." -ForegroundColor Cyan

# 1. User Management Backend (Port 8085)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'UserManagmentModule/backend'; Write-Host 'Starting User Management Backend (:8085)...' -ForegroundColor Green; .\mvnw.cmd spring-boot:run" -WindowStyle Normal

# 2. Inventory Backend (Port 8081)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'InventoryModuleNew/backend'; Write-Host 'Starting Inventory Backend (:8081)...' -ForegroundColor Green; & 'c:/Users/randi/OneDrive/Desktop/MIS system int/LogesticAndShipmentModule/backend/.maven/apache-maven-3.9.6/bin/mvn.cmd' spring-boot:run" -WindowStyle Normal

# 3. Order & Billing Backend (Port 8082)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'OrderAndBillingModule/backend'; Write-Host 'Starting Order & Billing Backend (:8082)...' -ForegroundColor Green; & 'c:/Users/randi/OneDrive/Desktop/MIS system int/LogesticAndShipmentModule/backend/.maven/apache-maven-3.9.6/bin/mvn.cmd' spring-boot:run" -WindowStyle Normal

# 4. Logistics Backend (Port 8080)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'LogesticAndShipmentModule/backend'; Write-Host 'Starting Logistics Backend (:8080)...' -ForegroundColor Green; & 'c:/Users/randi/OneDrive/Desktop/MIS system int/LogesticAndShipmentModule/backend/.maven/apache-maven-3.9.6/bin/mvn.cmd' spring-boot:run" -WindowStyle Normal

Write-Host ""
Write-Host "Starting Frontends in separate windows..." -ForegroundColor Cyan

# 1. User Management Frontend (Port 5175)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'UserManagmentModule/frontend'; Write-Host 'Starting User Management Frontend (:5175)...' -ForegroundColor Green; npm run dev" -WindowStyle Normal

# 2. Inventory Frontend (Port 3000)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'InventoryModuleNew/frontend'; Write-Host 'Starting Inventory Frontend (:3000)...' -ForegroundColor Green; npm start" -WindowStyle Normal

# 3. Order & Billing Frontend (Port 5173/5174)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'OrderAndBillingModule/frontend'; Write-Host 'Starting Order & Billing Frontend...' -ForegroundColor Green; npm run dev" -WindowStyle Normal

# 4. Logistics Frontend (Port 5173/5174)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'LogesticAndShipmentModule/frontend'; Write-Host 'Starting Logistics Frontend...' -ForegroundColor Green; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "All backends and frontends have been launched!" -ForegroundColor Green
Write-Host "Check the newly opened terminal windows for logs." -ForegroundColor Yellow
Write-Host "==================================================" -ForegroundColor Cyan
