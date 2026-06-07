@echo off
title SCM System - Starting Inventory Backend (:8081)
echo ==================================================
echo Starting Inventory Backend on port 8081...
echo ==================================================
cd /d "%~dp0..\InventoryModuleNew\backend"
call "%~dp0..\LogesticAndShipmentModule\backend\.maven\apache-maven-3.9.6\bin\mvn.cmd" spring-boot:run
pause
