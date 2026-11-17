@echo off
title Kisan Mitra - Full Microservices Launcher
echo ===============================================================================
echo   Kisan Mitra: Digital Agricultural Marketplace (Group 19)
echo   Decoupled Microservice Architecture (Assignment 02 and Assignment 05)
echo ===============================================================================
echo.

set "BASE_DIR=%~dp0"

if exist "%BASE_DIR%02_Project_Source_Code\orders-service" (
    set "CODE_DIR=%BASE_DIR%02_Project_Source_Code\"
) else (
    set "CODE_DIR=%BASE_DIR%"
)

echo [1/6] Launching Orders Microservice (REST Port 5000)...
start "Kisan Mitra - Orders Service (5000)" cmd /k "cd /d "%CODE_DIR%orders-service" && npm start"

echo [2/6] Launching Users Microservice (REST Port 5001)...
start "Kisan Mitra - Users Service (5001)" cmd /k "cd /d "%CODE_DIR%users-service" && npm start"

echo [3/6] Launching Catalogue Microservice (REST Port 5002)...
start "Kisan Mitra - Catalogue Service (5002)" cmd /k "cd /d "%CODE_DIR%catalogue-service" && npm start"

echo [4/6] Launching Delivery Microservice (REST Port 5003)...
start "Kisan Mitra - Delivery Service (5003)" cmd /k "cd /d "%CODE_DIR%delivery-service" && npm start"

echo [5/6] Launching AI & Agronomy Microservice (REST Port 5004)...
start "Kisan Mitra - AI Service (5004)" cmd /k "cd /d "%CODE_DIR%ai-service" && npm start"

echo [6/6] Launching Frontend React Client (Port 5173)...
start "Kisan Mitra - Frontend (5173)" cmd /k "cd /d "%CODE_DIR%frontend" && npm run dev"

echo.
echo Waiting 5 seconds for services to initialize...
ping 127.0.0.1 -n 6 >nul

echo Opening Kisan Mitra in your default browser...
start http://localhost:5173

echo ===============================================================================
echo   SUCCESS: All 6 decoupled applications are running:
echo   - Frontend Web App:     http://localhost:5173
echo   - Orders Microservice:  http://localhost:5000/health
echo   - Users Microservice:   http://localhost:5001/health
echo   - Catalogue Service:    http://localhost:5002/health
echo   - Delivery Service:     http://localhost:5003/health
echo   - AI & Vision Service:  http://localhost:5004/health
echo ===============================================================================
echo Press any key to close this launcher console (servers will remain active)...
pause >nul
