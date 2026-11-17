@echo off
cd /d "D:\Kisan-Mitra"
echo ========================================================
echo   Pushing Kisan Mitra to GitHub (vivek43111/kisan-mitra)
echo ========================================================
echo.
git push -u origin main
echo.
if %ERRORLEVEL% equ 0 (
    echo ========================================================
    echo   SUCCESS! Your project is now live on GitHub:
    echo   https://github.com/vivek43111/kisan-mitra
    echo ========================================================
) else (
    echo [!] Push failed. Please make sure you created the empty repo at:
    echo     https://github.com/new (Repository name: kisan-mitra)
)
echo.
pause
