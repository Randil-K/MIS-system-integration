# PowerShell script to run the User Management frontend
if (!(Test-Path "$PSScriptRoot\node_modules")) {
    Write-Host "--------------------------------------------------" -ForegroundColor Cyan
    Write-Host "Installing frontend dependencies..." -ForegroundColor Green
    Write-Host "--------------------------------------------------" -ForegroundColor Cyan
    npm install
}

Write-Host "--------------------------------------------------" -ForegroundColor Cyan
Write-Host "Starting User Management Frontend..." -ForegroundColor Green
Write-Host "Press Ctrl+C to terminate." -ForegroundColor Cyan
Write-Host "--------------------------------------------------" -ForegroundColor Cyan

npm run dev
