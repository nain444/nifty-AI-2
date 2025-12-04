@echo off
echo ═══════════════════════════════════════════════════════════════
echo    AUTOMATIC GITHUB PUSH - NIFTY AI MOBILE
echo ═══════════════════════════════════════════════════════════════
echo.

REM Check if Git is available
where git >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ERROR: Git is not found in PATH!
    echo.
    echo SOLUTIONS:
    echo 1. Restart your computer to refresh PATH
    echo 2. Or use GitHub Desktop instead ^(easier^)
    echo    Download from: https://desktop.github.com/
    echo.
    pause
    exit /b 1
)

echo ✓ Git found! Proceeding with setup...
echo.

REM Initialize Git repository if not already done
if not exist .git (
    echo [1/7] Initializing Git repository...
    git init
    echo ✓ Repository initialized
    echo.
) else (
    echo [1/7] Git repository already exists
    echo.
)

REM Configure Git user if not set
git config user.name >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [2/7] Configuring Git user...
    git config user.name "nain444"
    git config user.email "nain444@users.noreply.github.com"
    echo ✓ Git user configured
    echo.
) else (
    echo [2/7] Git user already configured
    echo.
)

REM Create .gitignore if it doesn't exist
if not exist .gitignore (
    echo [3/7] Creating .gitignore...
    (
        echo node_modules/
        echo dist/
        echo android-sdk-portable/
        echo *.log
        echo .DS_Store
        echo android/local.properties
        echo android/.gradle/
        echo android/build/
        echo android/app/build/
    ) > .gitignore
    echo ✓ .gitignore created
    echo.
) else (
    echo [3/7] .gitignore already exists
    echo.
)

REM Add all files
echo [4/7] Adding all files to Git...
git add .
echo ✓ Files added
echo.

REM Commit
echo [5/7] Creating commit...
git commit -m "Initial commit: NIFTY AI Mobile Trading App with Android APK support"
if %ERRORLEVEL% EQU 0 (
    echo ✓ Commit created
) else (
    echo ℹ No changes to commit or already committed
)
echo.

REM Set main branch
echo [6/7] Setting main branch...
git branch -M main
echo ✓ Branch set to main
echo.

REM Add remote if not exists
git remote get-url origin >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [7/7] Adding GitHub remote...
    git remote add origin https://github.com/nain444/nifty-AI-2.git
    echo ✓ Remote added
) else (
    echo [7/7] Remote already exists
)
echo.

REM Push to GitHub
echo ═══════════════════════════════════════════════════════════════
echo    PUSHING TO GITHUB...
echo ═══════════════════════════════════════════════════════════════
echo.
echo You may be asked to sign in to GitHub.
echo Please enter your credentials when prompted.
echo.

git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ═══════════════════════════════════════════════════════════════
    echo    ✅ SUCCESS! CODE PUSHED TO GITHUB!
    echo ═══════════════════════════════════════════════════════════════
    echo.
    echo NEXT STEPS TO GET YOUR APK:
    echo.
    echo 1. Go to: https://github.com/nain444/nifty-AI-2
    echo 2. Click the "Actions" tab at the top
    echo 3. Click "Build Android APK" workflow on the left
    echo 4. Click green "Run workflow" button on the right
    echo 5. Click "Run workflow" in the dropdown
    echo 6. Wait 5-10 minutes for build to complete
    echo 7. Download APK from "Artifacts" section
    echo 8. Extract the ZIP file to get app-debug.apk
    echo 9. Copy to your phone and install!
    echo.
    echo ═══════════════════════════════════════════════════════════════
) else (
    echo.
    echo ═══════════════════════════════════════════════════════════════
    echo    ❌ PUSH FAILED!
    echo ═══════════════════════════════════════════════════════════════
    echo.
    echo POSSIBLE REASONS:
    echo 1. Authentication failed - you need to sign in
    echo 2. Repository already exists with different content
    echo 3. Network connection issue
    echo.
    echo EASIEST SOLUTION: Use GitHub Desktop instead!
    echo Download from: https://desktop.github.com/
    echo.
    echo See EASY-GITHUB-PUSH.txt for detailed instructions.
    echo.
)

pause
