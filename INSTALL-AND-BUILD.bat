@echo off
setlocal enabledelayedexpansion
title NIFTY AI Trader - Complete APK Builder
color 0B

:MENU
cls
echo.
echo ========================================
echo   NIFTY AI Trader - APK Builder
echo ========================================
echo.
echo Choose your build method:
echo.
echo [1] Quick Build (Recommended)
echo     - Uses existing Android SDK if available
echo     - Downloads minimal components
echo     - Fastest option
echo.
echo [2] Full SDK Setup + Build
echo     - Downloads complete Android SDK
echo     - Installs all required tools
echo     - Best for first-time users
echo.
echo [3] Build Only (SDK already installed)
echo     - Skip SDK setup
echo     - Just build the APK
echo.
echo [4] GitHub Actions (Cloud Build)
echo     - Build APK online (no local setup)
echo     - Requires GitHub account
echo.
echo [5] Exit
echo.
echo ========================================
echo.
set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" goto QUICK_BUILD
if "%choice%"=="2" goto FULL_SETUP
if "%choice%"=="3" goto BUILD_ONLY
if "%choice%"=="4" goto GITHUB_BUILD
if "%choice%"=="5" exit
goto MENU

:QUICK_BUILD
cls
echo.
echo Starting Quick Build...
echo.
call QUICK-BUILD-APK.bat
goto END

:FULL_SETUP
cls
echo.
echo Starting Full SDK Setup...
echo.
echo This will:
echo   - Download Android SDK (150MB)
echo   - Install required tools
echo   - Set environment variables
echo   - Build the APK
echo.
set /p confirm="Continue? (Y/N): "
if /i not "%confirm%"=="Y" goto MENU

call setup-android-sdk.bat
echo.
echo SDK Setup complete!
echo.
echo Press any key to build APK...
pause >nul
call BUILD-APK.bat
goto END

:BUILD_ONLY
cls
echo.
echo Building APK...
echo.
call BUILD-APK.bat
goto END

:GITHUB_BUILD
cls
echo.
echo ========================================
echo   GitHub Actions Cloud Build
echo ========================================
echo.
echo To build APK using GitHub Actions:
echo.
echo 1. Create a GitHub repository
echo 2. Push this project to GitHub:
echo.
echo    git init
echo    git add .
echo    git commit -m "Initial commit"
echo    git remote add origin YOUR_REPO_URL
echo    git push -u origin main
echo.
echo 3. Go to: Actions tab on GitHub
echo 4. Run "Build Android APK" workflow
echo 5. Download APK from Artifacts
echo.
echo The workflow file is already created at:
echo .github/workflows/build-apk.yml
echo.
pause
goto MENU

:END
echo.
echo ========================================
echo   Process Complete!
echo ========================================
echo.
if exist "NIFTY-AI-Trader.apk" (
    echo APK File: NIFTY-AI-Trader.apk
    echo.
    echo To install on your Android phone:
    echo   1. Copy NIFTY-AI-Trader.apk to phone
    echo   2. Open the APK file
    echo   3. Tap Install
    echo.
    echo Opening folder...
    start explorer .
) else (
    echo Build may have failed. Check errors above.
)
echo.
pause
exit
