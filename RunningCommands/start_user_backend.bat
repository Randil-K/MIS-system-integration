@echo off
title SCM System - Starting User Management Backend (:8085)
echo ==================================================
echo Starting User Management Backend on port 8085...
echo ==================================================
cd ..\UserManagmentModule\backend
call .\mvnw.cmd spring-boot:run
pause
