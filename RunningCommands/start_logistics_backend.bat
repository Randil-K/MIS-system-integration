@echo off
title SCM System - Starting Logistics Backend (:8080)
echo ==================================================
echo Starting Logistics Backend on port 8080...
echo ==================================================
cd ..\LogesticAndShipmentModule\backend
call ..\LogesticAndShipmentModule\backend\.maven\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run
pause
