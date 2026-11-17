@echo off
title Kisan Mitra - Dependency Installer
echo ===============================================================================
echo   Kisan Mitra: Digital Agricultural Marketplace (Group 19)
echo   Automatic Environment Setup ^& Dependency Installer
echo ===============================================================================
echo.

set "BASE_DIR=%~dp0"
if exist "%BASE_DIR%02_Project_Source_Code\orders-service" (
    set "SRC_DIR=%BASE_DIR%02_Project_Source_Code"
) else (
    set "SRC_DIR=%BASE_DIR%"
)

:: Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Node.js is NOT installed on this computer!
    echo.
    echo Node.js is required to run the frontend and backend services.
    echo Please download and install the LTS version of Node.js from:
    echo https://nodejs.org
    echo.
    echo After installing Node.js, re-run this setup script.
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js is detected:
node -v
echo.

echo -------------------------------------------------------------------------------
echo [1/5] Installing Frontend Dependencies (React, Vite, Tailwind)...
echo -------------------------------------------------------------------------------
cd /d "%SRC_DIR%\frontend"
call npm install
if %errorlevel% neq 0 (
    echo [WARNING] npm install in frontend had issues, retrying...
    call npm install --no-audit
)

echo.
echo -------------------------------------------------------------------------------
echo [2/5] Installing Orders Microservice Dependencies (Port 5000)...
echo -------------------------------------------------------------------------------
cd /d "%SRC_DIR%\orders-service"
call npm install

echo.
echo -------------------------------------------------------------------------------
echo [3/5] Installing Users Microservice Dependencies (Port 5001)...
echo -------------------------------------------------------------------------------
cd /d "%SRC_DIR%\users-service"
call npm install

echo.
echo -------------------------------------------------------------------------------
echo [4/5] Installing Catalogue Microservice Dependencies (Port 5002)...
echo -------------------------------------------------------------------------------
cd /d "%SRC_DIR%\catalogue-service"
call npm install

echo.
echo -------------------------------------------------------------------------------
echo [5/6] Installing Delivery Microservice Dependencies (Port 5003)...
echo -------------------------------------------------------------------------------
cd /d "%SRC_DIR%\delivery-service"
call npm install

echo.
echo -------------------------------------------------------------------------------
echo [6/6] Installing AI Microservice Dependencies (Port 5004)...
echo -------------------------------------------------------------------------------
cd /d "%SRC_DIR%\ai-service"
call npm install

echo.
echo ===============================================================================
echo   SUCCESS! All dependencies have been installed successfully.
echo   You can now launch the full project by double-clicking:
echo   START_PROJECT.bat
echo ===============================================================================
echo.
pause
