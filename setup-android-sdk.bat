@echo off
title Setup Android SDK for APK Build
echo.
echo ========================================
echo   Android SDK Setup for NIFTY AI Trader
echo ========================================
echo.

set SDK_DIR=C:\Android-SDK
set CMDLINE_TOOLS_URL=https://dl.google.com/android/repository/commandlinetools-win-9477386_latest.zip
set CMDLINE_ZIP=%TEMP%\android-cmdline-tools.zip

echo [1/5] Creating SDK directory...
if not exist "%SDK_DIR%" mkdir "%SDK_DIR%"
if not exist "%SDK_DIR%\cmdline-tools" mkdir "%SDK_DIR%\cmdline-tools"

echo [2/5] Downloading Android Command Line Tools...
echo This may take a few minutes (150MB download)...
powershell -Command "& {Invoke-WebRequest -Uri '%CMDLINE_TOOLS_URL%' -OutFile '%CMDLINE_ZIP%'}"

if not exist "%CMDLINE_ZIP%" (
    echo ERROR: Download failed!
    pause
    exit /b 1
)

echo [3/5] Extracting tools...
powershell -Command "& {Expand-Archive -Path '%CMDLINE_ZIP%' -DestinationPath '%SDK_DIR%\cmdline-tools' -Force}"
move "%SDK_DIR%\cmdline-tools\cmdline-tools" "%SDK_DIR%\cmdline-tools\latest"

echo [4/5] Setting environment variables...
setx ANDROID_HOME "%SDK_DIR%" /M
setx PATH "%PATH%;%SDK_DIR%\cmdline-tools\latest\bin;%SDK_DIR%\platform-tools" /M

echo [5/5] Installing SDK packages...
echo Please accept all licenses when prompted...
cd /d "%SDK_DIR%\cmdline-tools\latest\bin"
call sdkmanager.bat "platform-tools" "platforms;android-33" "build-tools;33.0.0"
call sdkmanager.bat --licenses

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Android SDK installed at: %SDK_DIR%
echo.
echo IMPORTANT: Close this window and restart your computer
echo           for environment variables to take effect.
echo.
echo After restart, run: BUILD-APK.bat
echo.
pause
