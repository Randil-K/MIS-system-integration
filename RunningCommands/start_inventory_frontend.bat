@echo off
title SCM System - Starting Inventory Frontend (:3000)
echo ==================================================
echo Starting Inventory Frontend on port 3000...
echo ==================================================
cd /d "%~dp0..\InventoryModuleNew\frontend"
call npm start
pause
