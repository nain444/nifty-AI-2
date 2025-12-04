@echo off
title Push to GitHub - NIFTY AI Trader
color 0B

echo.
echo ========================================
echo   Push to GitHub for Cloud Build
echo ========================================
echo.

:: Check if git is installed
git --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Git is not installed!
    echo.
    echo Please install Git first:
    echo https://git-scm.com/download/win
    echo.
    set /p open="Open download page? (Y/N): "
    if /i "!open!"=="Y" start https://git-scm.com/download/win
    pause
    exit /b 1
)

echo [OK] Git is installed
echo.

:: Initialize git if needed
if not exist ".git" (
    echo Initializing Git repository...
    git init
    echo.
)

:: Create README
echo # NIFTY AI Trader - Android App > README.md
echo. >> README.md
echo AI-powered NIFTY 50 trading signals for Android. >> README.md
echo. >> README.md
echo ## Features >> README.md
echo - AI-powered CALL/PUT/EXIT signals >> README.md
echo - 8 Technical indicators >> README.md
echo - News sentiment analysis >> README.md
echo - Sound + vibration alerts >> README.md
echo. >> README.md
echo ## Build APK >> README.md
echo Go to Actions tab and run "Build Android APK" workflow. >> README.md

echo [1/5] Adding files...
git add .

echo [2/5] Committing...
git commit -m "NIFTY AI Trader - Complete Android App"

echo [3/5] Setting branch to main...
git branch -M main

echo [4/5] Adding remote...
git remote remove origin 2>nul
git remote add origin https://github.com/nain444/nifty-AI-2.git

echo [5/5] Pushing to GitHub...
echo.
echo You may need to enter your GitHub credentials...
echo.
git push -u origin main --force

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   SUCCESS! Code pushed to GitHub
    echo ========================================
    echo.
    echo Next steps:
    echo   1. Go to: https://github.com/nain444/nifty-AI-2
    echo   2. Click "Actions" tab
    echo   3. Click "Build Android APK"
    echo   4. Click "Run workflow"
    echo   5. Wait 5-10 minutes
    echo   6. Download APK from Artifacts
    echo.
    set /p open="Open GitHub repository now? (Y/N): "
    if /i "!open!"=="Y" start https://github.com/nain444/nifty-AI-2
) else (
    echo.
    echo ========================================
    echo   PUSH FAILED
    echo ========================================
    echo.
    echo Common issues:
    echo   1. Need to authenticate with GitHub
    echo   2. Repository doesn't exist
    echo   3. No internet connection
    echo.
    echo Try:
    echo   - Create repository first: https://github.com/new
    echo   - Use GitHub Desktop instead
    echo.
)

echo.
pause
