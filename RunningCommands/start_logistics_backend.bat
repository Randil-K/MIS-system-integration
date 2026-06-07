@echo off
title SCM System - How to run Logistics Backend
echo ==================================================
echo Logistics Backend Running Instructions
echo ==================================================
echo PREREQUISITE:
echo - Make sure MySQL Database is running (via XAMPP or start_database.bat).
echo - Do NOT start XAMPP Apache or Tomcat (to avoid port conflicts).
echo ==================================================
echo 1. Right click your "LogesticAndShipmentModule/backend" folder in your editor or explorer and click "Copy Path".
echo 2. Go to your terminal, type "cd " and paste the path inside quotes, then press Enter:
echo    cd "C:\path\to\LogesticAndShipmentModule\backend"
echo 3. Start the backend by running:
echo    .maven\apache-maven-3.9.6\bin\mvn.cmd clean spring-boot:run
echo ==================================================
pause
