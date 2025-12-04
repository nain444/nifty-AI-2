@echo off
title Build NIFTY AI Trader APK
echo.
echo ========================================
echo   Building NIFTY AI Trader APK
echo ========================================
echo.

:: Check if Android SDK is installed
if not defined ANDROID_HOME (
    echo ERROR: Android SDK not found!
    echo.
    echo Please run: setup-android-sdk.bat first
    echo.
    pause
    exit /b 1
)

echo Android SDK found at: %ANDROID_HOME%
echo.

:: Check if local.properties exists
if not exist "android\local.properties" (
    echo Creating local.properties...
    echo sdk.dir=%ANDROID_HOME:\=\\% > android\local.properties
)

echo [1/3] Syncing Capacitor...
call npx cap sync android

echo.
echo [2/3] Building APK (this may take 5-10 minutes)...
cd android
call gradlew.bat assembleDebug --no-daemon

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Build failed!
    echo.
    pause
    exit /b 1
)

echo.
echo [3/3] Copying APK to root folder...
cd ..
copy "android\app\build\outputs\apk\debug\app-debug.apk" "NIFTY-AI-Trader.apk"

echo.
echo ========================================
echo   BUILD SUCCESSFUL!
echo ========================================
echo.
echo APK Location: NIFTY-AI-Trader.apk
echo File Size: 
dir "NIFTY-AI-Trader.apk" | findstr "apk"
echo.
echo To install on your phone:
echo   1. Copy NIFTY-AI-Trader.apk to your phone
echo   2. Open the APK file on your phone
echo   3. Allow "Install from unknown sources" if prompted
echo   4. Tap Install
echo.
pause
