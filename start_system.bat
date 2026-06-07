@echo off
cd /d "%~dp0"
title SCM System - Starting Up
echo ==================================================
echo Launching SCM Integrated System Services...
echo ==================================================
powershell -ExecutionPolicy Bypass -File ".\run_all.ps1"
echo ==================================================
echo Services launched. You can close this window.
echo ==================================================
pause
