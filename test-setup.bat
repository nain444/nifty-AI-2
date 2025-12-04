@echo off
title System Check - NIFTY AI Trader
color 0A

echo.
echo ========================================
echo   NIFTY AI Trader - System Check
echo ========================================
echo.
echo Running diagnostics...
echo.

set PASS=0
set FAIL=0

:: Test 1: Java
echo [TEST 1/5] Java Installation
java -version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Java is installed
    set /a PASS+=1
) else (
    echo [FAIL] Java NOT found
    echo        Install from: https://adoptium.net/temurin/releases/
    set /a FAIL+=1
)
echo.

:: Test 2: Node.js
echo [TEST 2/5] Node.js Installation
node --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Node.js is installed
    set /a PASS+=1
) else (
    echo [FAIL] Node.js NOT found
    echo        Install from: https://nodejs.org/
    set /a FAIL+=1
)
echo.

:: Test 3: npm
echo [TEST 3/5] npm Installation
npm --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [PASS] npm is installed
    set /a PASS+=1
) else (
    echo [FAIL] npm NOT found
    set /a FAIL+=1
)
echo.

:: Test 4: Project files
echo [TEST 4/5] Project Files
if exist "package.json" (
    if exist "www\index.html" (
        if exist "android\build.gradle" (
            echo [PASS] All project files present
            set /a PASS+=1
        ) else (
            echo [FAIL] Android project not initialized
            echo        Run: npx cap add android
            set /a FAIL+=1
        )
    ) else (
        echo [FAIL] www folder missing
        set /a FAIL+=1
    )
) else (
    echo [FAIL] package.json missing
    set /a FAIL+=1
)
echo.

:: Test 5: Dependencies
echo [TEST 5/5] Node Dependencies
if exist "node_modules" (
    echo [PASS] Dependencies installed
    set /a PASS+=1
) else (
    echo [WARN] Dependencies not installed
    echo        Run: npm install
    set /a FAIL+=1
)
echo.

:: Summary
echo ========================================
echo   TEST RESULTS
echo ========================================
echo.
echo Tests Passed: %PASS%/5
echo Tests Failed: %FAIL%/5
echo.

if %FAIL% EQU 0 (
    echo [SUCCESS] Your system is ready to build APK!
    echo.
    echo Next step: Run START-HERE.bat
) else (
    echo [WARNING] Some tests failed.
    echo.
    echo Please fix the issues above before building APK.
    echo.
    echo Need help? Read: HOW-TO-BUILD-APK.md
)
echo.
echo ========================================
echo.
pause
