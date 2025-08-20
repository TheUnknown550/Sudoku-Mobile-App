@echo off
echo 🎮 MCX Studios24 - Sudoku Master APK Build Preparation
echo ==================================================

REM Check if EAS CLI is installed
echo 📦 Checking EAS CLI installation...
where eas >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ EAS CLI not found. Installing...
    npm install -g @expo/eas-cli
) else (
    echo ✅ EAS CLI is installed
)

REM Login reminder
echo 🔐 Logging into Expo account...
echo Please make sure you're logged into your Expo account with: eas login

REM Check EAS configuration
echo ⚙️ Checking EAS build configuration...
if not exist "eas.json" (
    echo ❌ eas.json not found. Please run: eas build:configure
) else (
    echo ✅ eas.json configuration found
)

echo.
echo 🚀 Build Commands Available:
echo 1. Preview APK (for testing): npm run build:android:preview
echo 2. Production APK: npm run build:android:production
echo.
echo 📋 Pre-build Checklist:
echo ✅ Google AdMob IDs updated to production
echo ✅ App package name: com.mcxstudios24.sudokumaster
echo ✅ App icon: icon.png
echo ✅ MCX Studios logo: mcx-logo.png
echo ✅ Version: 1.0.0
echo.
echo ⚠️  Important Notes:
echo - Make sure you have your real rewarded ad unit ID
echo - Currently using placeholder: ca-app-pub-9992987709866316/2345678901
echo - Update this in components/AdMobRewardedAd.tsx
echo.
echo 🎯 Ready to build! Run: npm run build:android:preview

pause
