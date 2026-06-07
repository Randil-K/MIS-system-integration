@echo off
title SCM System - Starting Inventory Backend (:8081)
echo ==================================================
echo Starting Inventory Backend on port 8081...
echo ==================================================
cd ..\InventoryModuleNew\backend
call ..\LogesticAndShipmentModule\backend\.maven\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run
pause
