@echo off
title Kisan Mitra - AI Service (5004)
echo ===============================================================================
echo   Kisan Mitra: AI Agro-Advisory & Vision Diagnosis Service (Port 5004)
echo   Dual Engine: Google Gemini 1.5 Flash + ICAR Plant Pathology Knowledge Base
echo ===============================================================================
echo.

set "BASE_DIR=%~dp0"
if exist "%BASE_DIR%02_Project_Source_Code\ai-service" (
    cd /d "%BASE_DIR%02_Project_Source_Code\ai-service"
) else (
    cd /d "%BASE_DIR%ai-service"
)

npm start
