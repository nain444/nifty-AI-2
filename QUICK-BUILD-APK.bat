@echo off
title Quick APK Build - NIFTY AI Trader
color 0A
echo.
echo ========================================
echo   NIFTY AI Trader - Quick APK Builder
echo ========================================
echo.

:: Check for Java
java -version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Java not found!
    echo.
    echo Please install Java 17 or higher from:
    echo https://adoptium.net/temurin/releases/
    echo.
    pause
    exit /b 1
)

echo [OK] Java found
echo.

:: Set local Android SDK path (portable)
set LOCAL_SDK=%CD%\android-sdk-portable
set ANDROID_HOME=%LOCAL_SDK%

:: Check if portable SDK exists
if not exist "%LOCAL_SDK%\platform-tools" (
    echo Android SDK not found. Setting up portable SDK...
    echo.
    
    :: Create directories
    mkdir "%LOCAL_SDK%\platforms"
    mkdir "%LOCAL_SDK%\build-tools"
    mkdir "%LOCAL_SDK%\platform-tools"
    
    echo Downloading minimal SDK components...
    echo This is a one-time setup (may take 5-10 minutes)
    echo.
    
    :: Download platform-tools
    powershell -Command "& {Write-Host 'Downloading platform-tools...'; Invoke-WebRequest -Uri 'https://dl.google.com/android/repository/platform-tools-latest-windows.zip' -OutFile '%TEMP%\platform-tools.zip'; Expand-Archive -Path '%TEMP%\platform-tools.zip' -DestinationPath '%LOCAL_SDK%' -Force}"
    
    echo.
    echo SDK setup complete!
    echo.
)

:: Create local.properties
echo sdk.dir=%LOCAL_SDK:\=\\% > android\local.properties

echo [1/2] Syncing project...
call npx cap sync android

echo.
echo [2/2] Building APK...
echo This will take 5-10 minutes on first build...
echo.

cd android
call gradlew.bat assembleDebug --no-daemon --warning-mode all

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ========================================
    echo   BUILD FAILED
    echo ========================================
    echo.
    echo Common issues:
    echo   1. Java version too old (need Java 17+)
    echo   2. Internet connection required for first build
    echo   3. Antivirus blocking Gradle
    echo.
    echo Try running: setup-android-sdk.bat for full SDK
    echo.
    pause
    exit /b 1
)

cd ..

:: Copy APK
copy "android\app\build\outputs\apk\debug\app-debug.apk" "NIFTY-AI-Trader.apk" >nul

echo.
echo ========================================
echo   SUCCESS! APK BUILT
echo ========================================
echo.
echo File: NIFTY-AI-Trader.apk
for %%A in ("NIFTY-AI-Trader.apk") do echo Size: %%~zA bytes
echo.
echo To install on Android:
echo   1. Copy NIFTY-AI-Trader.apk to your phone
echo   2. Open the file and tap Install
echo   3. Enable "Install from unknown sources" if asked
echo.
echo Opening folder...
explorer .
echo.
pause
