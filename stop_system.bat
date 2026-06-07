@echo off
cd /d "%~dp0"
title SCM System - Shutting Down
echo ==================================================
echo Stopping all SCM Backend and Frontend Services...
echo ==================================================
powershell -ExecutionPolicy Bypass -File ".\stop_all.ps1"
echo ==================================================
echo Services terminated successfully.
echo ==================================================
pause
