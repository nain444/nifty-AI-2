@echo off
title NIFTY AI Trader - APK Builder Setup
color 0E
mode con: cols=80 lines=40

:START
cls
echo.
echo  ===============================================================================
echo                      NIFTY AI TRADER - APK BUILDER
echo  ===============================================================================
echo.
echo  Welcome! This wizard will help you build an Android APK file.
echo.
echo  Checking your system...
echo.

:: Check Java
echo  [1/3] Checking Java installation...
java -version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo  [OK] Java is installed
    for /f "tokens=3" %%g in ('java -version 2^>^&1 ^| findstr /i "version"') do (
        set JAVA_VERSION=%%g
    )
    echo       Version: !JAVA_VERSION!
) else (
    echo  [X] Java NOT found
    echo.
    echo  You need Java 17 or higher to build APK.
    echo.
    echo  Download from: https://adoptium.net/temurin/releases/
    echo.
    set /p download="Open download page now? (Y/N): "
    if /i "!download!"=="Y" start https://adoptium.net/temurin/releases/
    echo.
    echo  After installing Java, restart this script.
    pause
    exit
)

echo.

:: Check Node.js
echo  [2/3] Checking Node.js installation...
node --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo  [OK] Node.js is installed
    for /f %%v in ('node --version') do echo       Version: %%v
) else (
    echo  [X] Node.js NOT found
    echo.
    echo  Installing Node.js...
    echo  This may take a few minutes...
    echo.
    :: Try to install via winget if available
    winget install OpenJS.NodeJS.LTS >nul 2>&1
    if %ERRORLEVEL% NEQ 0 (
        echo  Please install Node.js manually from: https://nodejs.org/
        set /p download="Open download page now? (Y/N): "
        if /i "!download!"=="Y" start https://nodejs.org/
        echo.
        echo  After installing Node.js, restart this script.
        pause
        exit
    )
)

echo.

:: Check npm packages
echo  [3/3] Checking project dependencies...
if not exist "node_modules" (
    echo  Installing npm packages...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo  [X] npm install failed
        pause
        exit
    )
)
echo  [OK] Dependencies installed

echo.
echo  ===============================================================================
echo                           SYSTEM CHECK COMPLETE
echo  ===============================================================================
echo.
echo  Your system is ready to build APK!
echo.
echo  Choose your build method:
echo.
echo  [1] QUICK BUILD (Recommended)
echo      - Fastest method
echo      - Downloads minimal SDK
echo      - Time: 10-15 minutes
echo.
echo  [2] FULL SDK SETUP
echo      - Complete Android SDK
echo      - Best for multiple builds
echo      - Time: 20-30 minutes
echo.
echo  [3] GITHUB ACTIONS (Cloud Build)
echo      - Build online (no local setup)
echo      - Requires GitHub account
echo      - Time: 5-10 minutes
echo.
echo  [4] READ DOCUMENTATION
echo      - View complete guide
echo.
echo  [5] EXIT
echo.
echo  ===============================================================================
echo.
set /p method="Enter your choice (1-5): "

if "%method%"=="1" goto QUICK
if "%method%"=="2" goto FULL
if "%method%"=="3" goto GITHUB
if "%method%"=="4" goto DOCS
if "%method%"=="5" exit
goto START

:QUICK
cls
echo.
echo  Starting Quick Build...
echo.
echo  This will:
echo    - Download minimal Android SDK components
echo    - Build APK locally
echo    - Create NIFTY-AI-Trader.apk
echo.
echo  Time: 10-15 minutes (first build)
echo.
pause
call QUICK-BUILD-APK.bat
goto DONE

:FULL
cls
echo.
echo  Starting Full SDK Setup...
echo.
echo  This will:
echo    - Download complete Android SDK (150MB)
echo    - Install all required tools
echo    - Set environment variables
echo    - Build APK
echo.
echo  Time: 20-30 minutes
echo  Disk Space: 2GB
echo.
set /p confirm="Continue? (Y/N): "
if /i not "%confirm%"=="Y" goto START
call setup-android-sdk.bat
pause
call BUILD-APK.bat
goto DONE

:GITHUB
cls
echo.
echo  ===============================================================================
echo                        GITHUB ACTIONS CLOUD BUILD
echo  ===============================================================================
echo.
echo  To build APK using GitHub (no local setup needed):
echo.
echo  STEP 1: Create GitHub Repository
echo    - Go to: https://github.com/new
echo    - Create a new repository (public or private)
echo.
echo  STEP 2: Push Code to GitHub
echo    Run these commands in this folder:
echo.
echo    git init
echo    git add .
echo    git commit -m "NIFTY AI Trader"
echo    git remote add origin YOUR_REPO_URL
echo    git push -u origin main
echo.
echo  STEP 3: Build APK
echo    - Go to your repository on GitHub
echo    - Click "Actions" tab
echo    - Click "Build Android APK"
echo    - Click "Run workflow"
echo    - Wait 5-10 minutes
echo    - Download APK from "Artifacts"
echo.
echo  ===============================================================================
echo.
set /p open="Open GitHub now? (Y/N): "
if /i "%open%"=="Y" start https://github.com/new
echo.
pause
goto START

:DOCS
cls
start HOW-TO-BUILD-APK.md
goto START

:DONE
cls
echo.
echo  ===============================================================================
echo                              BUILD COMPLETE!
echo  ===============================================================================
echo.
if exist "NIFTY-AI-Trader.apk" (
    echo  [SUCCESS] APK file created!
    echo.
    echo  File: NIFTY-AI-Trader.apk
    for %%A in ("NIFTY-AI-Trader.apk") do echo  Size: %%~zA bytes
    echo.
    echo  ===============================================================================
    echo                      HOW TO INSTALL ON YOUR PHONE
    echo  ===============================================================================
    echo.
    echo  METHOD 1: USB Cable
    echo    1. Connect phone to PC via USB
    echo    2. Copy NIFTY-AI-Trader.apk to phone
    echo    3. Open the APK file on phone
    echo    4. Tap "Install"
    echo.
    echo  METHOD 2: Google Drive
    echo    1. Upload APK to Google Drive
    echo    2. Download on phone
    echo    3. Install
    echo.
    echo  METHOD 3: Email
    echo    1. Email APK to yourself
    echo    2. Download on phone
    echo    3. Install
    echo.
    echo  NOTE: You may need to enable "Install from unknown sources"
    echo        in your phone's security settings.
    echo.
    echo  ===============================================================================
    echo.
    set /p open="Open folder to see APK? (Y/N): "
    if /i "!open!"=="Y" start explorer .
) else (
    echo  [FAILED] APK was not created.
    echo.
    echo  Please check the errors above and try again.
    echo  Or try a different build method.
)
echo.
pause
exit
