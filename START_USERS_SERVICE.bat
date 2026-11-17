@echo off
title Users Microservice - Port 5001
set "BASE_DIR=%~dp0"
if exist "%BASE_DIR%02_Project_Source_Code\users-service" (
    set "CODE_DIR=%BASE_DIR%02_Project_Source_Code\"
) else (
    set "CODE_DIR=%BASE_DIR%"
)
cd /d "%CODE_DIR%users-service"
echo ========================================================
echo   Starting Users Microservice on http://localhost:5001
echo   RBAC Auth, Profile Management, Addresses
echo ========================================================
echo Opening http://localhost:5001/health in browser...
start "" cmd /c "ping 127.0.0.1 -n 3 >nul && start http://localhost:5001/health"
npm start
