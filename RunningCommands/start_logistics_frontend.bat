@echo off
title SCM System - Starting Logistics Frontend
echo ==================================================
echo Starting Logistics Frontend...
echo ==================================================
cd /d "%~dp0..\LogesticAndShipmentModule\frontend"
call npm run dev
pause
