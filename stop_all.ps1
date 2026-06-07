# SCM System Centralized Shutdown Script
Set-Location -Path $PSScriptRoot
$ErrorActionPreference = "Continue"

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "SHUTTING DOWN SUPPLY CHAIN MANAGEMENT SYSTEM" -ForegroundColor Red
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Define SCM system ports
$ports = @(
    8085, # User Management Backend
    8081, # Inventory Backend
    8082, # Order & Billing Backend
    8080, # Logistics Backend
    5175, # User Management Frontend
    3000, # Inventory Frontend
    5173, # Order & Billing Frontend / Logistics Frontend
    5174  # Order & Billing Frontend / Logistics Frontend
)

$stoppedCount = 0

foreach ($port in $ports) {
    # Find TCP connections on this port
    $connections = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    if ($connections) {
        foreach ($conn in $connections) {
            $procPid = $conn.OwningProcess
            if ($procPid -gt 0) {
                # Get the process name
                $proc = Get-Process -Id $procPid -ErrorAction SilentlyContinue
                $procName = "Unknown"
                if ($proc) {
                    $procName = $proc.Name
                }
                
                Write-Host "Found process '$procName' on port $port (PID: $procPid). Terminating..." -ForegroundColor Yellow
                Stop-Process -Id $procPid -Force -ErrorAction SilentlyContinue
                $stoppedCount++
            }
        }
    }
}

# Optional: Stop XAMPP MySQL if running
$mysqlCheck = Get-Process -Name "mysqld" -ErrorAction SilentlyContinue
if ($mysqlCheck) {
    Write-Host "Found running MySQL database process. Terminating..." -ForegroundColor Yellow
    Stop-Process -Name "mysqld" -Force -ErrorAction SilentlyContinue
    $stoppedCount++
}

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
if ($stoppedCount -gt 0) {
    Write-Host "Successfully terminated $stoppedCount service processes!" -ForegroundColor Green
} else {
    Write-Host "No running SCM service processes were found." -ForegroundColor Yellow
}
Write-Host "All ports have been cleared." -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan
