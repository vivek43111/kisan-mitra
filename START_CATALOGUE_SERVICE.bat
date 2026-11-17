@echo off
title Catalogue Microservice - Port 5002
set "BASE_DIR=%~dp0"
if exist "%BASE_DIR%02_Project_Source_Code\catalogue-service" (
    set "CODE_DIR=%BASE_DIR%02_Project_Source_Code\"
) else (
    set "CODE_DIR=%BASE_DIR%"
)
cd /d "%CODE_DIR%catalogue-service"
echo ========================================================
echo   Starting Catalogue Microservice on http://localhost:5002
echo   Crop Harvest Listings, Stock Levels, Mandi Pricing
echo ========================================================
echo Opening http://localhost:5002/health in browser...
start "" cmd /c "ping 127.0.0.1 -n 3 >nul && start http://localhost:5002/health"
npm start
