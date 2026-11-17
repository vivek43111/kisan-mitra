@echo off
title Frontend Web App - Port 5173
set "BASE_DIR=%~dp0"
if exist "%BASE_DIR%02_Project_Source_Code\frontend" (
    set "CODE_DIR=%BASE_DIR%02_Project_Source_Code\"
) else (
    set "CODE_DIR=%BASE_DIR%"
)
cd /d "%CODE_DIR%frontend"
echo ========================================================
echo   Starting Kisan Mitra Frontend on http://localhost:5173
echo   React 18 + Vite + Tailwind CSS UI
echo ========================================================
echo Opening http://localhost:5173 in browser...
start "" cmd /c "ping 127.0.0.1 -n 4 >nul && start http://localhost:5173"
npm run dev
