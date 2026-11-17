@echo off
title Delivery Microservice - Port 5003
set "BASE_DIR=%~dp0"
if exist "%BASE_DIR%02_Project_Source_Code\delivery-service" (
    set "CODE_DIR=%BASE_DIR%02_Project_Source_Code\"
) else (
    set "CODE_DIR=%BASE_DIR%"
)
cd /d "%CODE_DIR%delivery-service"
echo ========================================================
echo   Starting Delivery Microservice on http://localhost:5003
echo   Farm Dispatch, Logistics Tracking, Delivery Updates
echo ========================================================
echo Opening http://localhost:5003/health in browser...
start "" cmd /c "ping 127.0.0.1 -n 3 >nul && start http://localhost:5003/health"
npm start
