@echo off
title SCM System - Starting Order & Billing Backend (:8082)
echo ==================================================
echo Starting Order & Billing Backend on port 8082...
echo ==================================================
cd /d "%~dp0..\OrderAndBillingModule\backend"
call "%~dp0..\LogesticAndShipmentModule\backend\.maven\apache-maven-3.9.6\bin\mvn.cmd" spring-boot:run
pause
