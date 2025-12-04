@echo off
title NIFTY AI Trader - Mobile Server
echo.
echo ========================================
echo   NIFTY AI Trader - Mobile Server
echo ========================================
echo.

:: Get IP address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    set IP=%%a
    goto :found
)
:found
set IP=%IP:~1%

echo Your PC IP Address: %IP%
echo.
echo To install on your Android phone:
echo   1. Connect phone to same WiFi
echo   2. Open Chrome on phone
echo   3. Go to: http://%IP%:8080
echo   4. Tap menu ^> "Add to Home screen"
echo.
echo ========================================
echo.

node server.js

pause
