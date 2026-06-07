@echo off
title SCM System - How to run Order & Billing Backend
echo ==================================================
echo Order ^& Billing Backend Running Instructions
echo ==================================================
echo PREREQUISITE:
echo - Make sure MySQL Database is running (via XAMPP or start_database.bat).
echo - Do NOT start XAMPP Apache or Tomcat (to avoid port conflicts).
echo ==================================================
echo 1. Right click your "OrderAndBillingModule/backend" folder in your editor or explorer and click "Copy Path".
echo 2. Go to your terminal, type "cd " and paste the path inside quotes, then press Enter:
echo    cd "C:\path\to\OrderAndBillingModule\backend"
echo 3. Start the backend by running:
echo    .\mvnw.cmd clean spring-boot:run
echo ==================================================
pause
