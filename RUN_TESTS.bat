@echo off
title Kisan Mitra - Automated Integration Tests
echo ========================================================
echo   Kisan Mitra (Group 19) - Automated Backend Test Suite
echo ========================================================
echo.

set "BASE_DIR=%~dp0"
if exist "%BASE_DIR%02_Project_Source_Code\orders-service" (
    set "CODE_DIR=%BASE_DIR%02_Project_Source_Code\"
) else (
    set "CODE_DIR=%BASE_DIR%"
)

cd /d "%CODE_DIR%orders-service"
call npm test
echo.
echo ========================================================
echo   All test suites completed!
echo ========================================================
pause
