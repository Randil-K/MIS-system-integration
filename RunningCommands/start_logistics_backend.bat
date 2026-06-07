@echo off
title SCM System - Starting Logistics Backend (:8080)
echo ==================================================
echo Starting Logistics Backend on port 8080...
echo ==================================================
cd /d "%~dp0..\LogesticAndShipmentModule\backend"
call "%~dp0..\LogesticAndShipmentModule\backend\.maven\apache-maven-3.9.6\bin\mvn.cmd" spring-boot:run
pause
