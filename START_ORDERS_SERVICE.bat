@echo off
title Orders Microservice - Port 5000
set "BASE_DIR=%~dp0"
if exist "%BASE_DIR%02_Project_Source_Code\orders-service" (
    set "CODE_DIR=%BASE_DIR%02_Project_Source_Code\"
) else (
    set "CODE_DIR=%BASE_DIR%"
)
cd /d "%CODE_DIR%orders-service"
echo ========================================================
echo   Starting Orders Microservice on http://localhost:5000
echo   REST State Machine, RFC 7807, ETags, Rate Limiter
echo ========================================================
echo Opening http://localhost:5000/health in browser...
start "" cmd /c "ping 127.0.0.1 -n 3 >nul && start http://localhost:5000/health"
npm start
