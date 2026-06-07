@echo off
title SCM System - Starting User Management Frontend (:5175)
echo ==================================================
echo Starting User Management Frontend on port 5175...
echo ==================================================
cd /d "%~dp0..\UserManagmentModule\frontend"
call npm run dev
pause
