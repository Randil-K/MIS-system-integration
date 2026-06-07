@echo off
title SCM System - Starting Order & Billing Frontend
echo ==================================================
echo Starting Order & Billing Frontend...
echo ==================================================
cd /d "%~dp0..\OrderAndBillingModule\frontend"
call npm run dev
pause
