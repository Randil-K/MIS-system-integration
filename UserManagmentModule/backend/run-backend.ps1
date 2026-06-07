# PowerShell script to run the User Management backend using the Maven wrapper
Write-Host "--------------------------------------------------" -ForegroundColor Cyan
Write-Host "Starting User Management Backend (Port 8085)..." -ForegroundColor Green
Write-Host "SQLite database will be at: $PSScriptRoot\database.sqlite" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to terminate." -ForegroundColor Cyan
Write-Host "--------------------------------------------------" -ForegroundColor Cyan

# Run maven wrapper spring boot run target
& "$PSScriptRoot\mvnw.cmd" spring-boot:run
