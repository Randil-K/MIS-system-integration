@echo off
title SCM System - Starting MySQL Database
echo ==================================================
echo Starting XAMPP MySQL Database...
echo ==================================================
if exist "C:\xampp\mysql\bin\mysqld.exe" (
    start "" "C:\xampp\mysql\bin\mysqld.exe" --defaults-file=C:\xampp\mysql\bin\my.ini
    echo MySQL database process started in the background.
) else (
    echo Warning: C:\xampp\mysql\bin\mysqld.exe was not found.
    echo Please make sure XAMPP is installed or start MySQL manually on port 3306.
)
echo ==================================================
pause
