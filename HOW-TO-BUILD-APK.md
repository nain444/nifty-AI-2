# 📱 How to Build APK - Complete Guide

## 🚀 Quick Start (Easiest Method)

**Just double-click:** `INSTALL-AND-BUILD.bat`

This will show you a menu with all build options!

---

## 📋 Build Methods Comparison

| Method | Time | Difficulty | Requirements |
|--------|------|------------|--------------|
| **Quick Build** | 10-15 min | ⭐ Easy | Java 17+ |
| **Full SDK Setup** | 20-30 min | ⭐⭐ Medium | Java 17+ |
| **GitHub Actions** | 5-10 min | ⭐ Easy | GitHub account |
| **Manual Build** | 30+ min | ⭐⭐⭐ Hard | Android Studio |

---

## Method 1: Quick Build (Recommended)

### Requirements:
- Java 17 or higher ([Download](https://adoptium.net/temurin/releases/))

### Steps:
1. Double-click `QUICK-BUILD-APK.bat`
2. Wait 10-15 minutes
3. Get `NIFTY-AI-Trader.apk`

**What it does:**
- Downloads minimal Android SDK components
- Builds APK locally
- No Android Studio needed!

---

## Method 2: Full SDK Setup

### Requirements:
- Java 17 or higher
- 2GB free disk space
- Internet connection

### Steps:
1. Run `setup-android-sdk.bat` (one-time setup)
2. Restart your computer
3. Run `BUILD-APK.bat`
4. Get `NIFTY-AI-Trader.apk`

**What it does:**
- Installs complete Android SDK
- Sets up environment variables
- Best for multiple builds

---

## Method 3: GitHub Actions (Cloud Build)

### Requirements:
- GitHub account (free)
- Git installed

### Steps:

1. **Create GitHub repository:**
   - Go to https://github.com/new
   - Create a new repository

2. **Push code to GitHub:**
```bash
cd nifty-ai-mobile
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

3. **Build APK:**
   - Go to your repository on GitHub
   - Click "Actions" tab
   - Click "Build Android APK"
   - Click "Run workflow"
   - Wait 5-10 minutes
   - Download APK from "Artifacts"

**Advantages:**
- No local setup needed
- Builds in the cloud
- Free for public repositories

---

## Method 4: Manual Build (Advanced)

### Requirements:
- Android Studio installed
- Android SDK configured

### Steps:
```bash
cd nifty-ai-mobile
npx cap sync android
npx cap open android
```

Then in Android Studio:
- Build → Build Bundle(s) / APK(s) → Build APK(s)
- APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 📲 Installing APK on Your Phone

### Method 1: USB Cable
1. Connect phone to PC via USB
2. Copy `NIFTY-AI-Trader.apk` to phone
3. Open the APK file on phone
4. Tap "Install"
5. Enable "Install from unknown sources" if prompted

### Method 2: Google Drive / Cloud
1. Upload `NIFTY-AI-Trader.apk` to Google Drive
2. Open Drive on your phone
3. Download and install the APK

### Method 3: Direct Download
1. Host the APK on a web server
2. Open the URL on your phone
3. Download and install

---

## ⚠️ Troubleshooting

### "Java not found"
- Install Java 17: https://adoptium.net/temurin/releases/
- Restart your computer after installation

### "SDK location not found"
- Run `setup-android-sdk.bat` first
- Or set ANDROID_HOME manually

### "Build failed"
- Check Java version: `java -version` (need 17+)
- Check internet connection
- Disable antivirus temporarily
- Try "Full SDK Setup" method

### "App not installed" on phone
- Enable "Install from unknown sources" in phone settings
- Check if you have enough storage space
- Uninstall old version if exists

---

## 📊 APK Details

- **Package Name:** com.nifty.aitrader
- **App Name:** NIFTY AI Trader
- **Min Android:** 5.0 (API 21)
- **Target Android:** 13 (API 33)
- **Size:** ~15-20 MB
- **Permissions:** Internet, Notifications, Vibrate

---

## 🔐 Security Note

The APK built is a **debug version** for testing. For production/Play Store:

1. Generate signing key:
```bash
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

2. Configure signing in `android/app/build.gradle`

3. Build release APK:
```bash
cd android
gradlew.bat assembleRelease
```

---

## 🎯 Next Steps After Building

1. ✅ Install APK on your phone
2. ✅ Test all features
3. ✅ Share with friends
4. ✅ Publish to Play Store (optional)

---

## 💡 Tips

- First build takes longer (downloads dependencies)
- Subsequent builds are faster (5-10 minutes)
- Keep the `android-sdk-portable` folder for faster rebuilds
- Use GitHub Actions for easiest cloud builds

---

## 📞 Need Help?

If you encounter issues:
1. Check the error message carefully
2. Try a different build method
3. Ensure Java 17+ is installed
4. Check internet connection
5. Try running as Administrator

---

**Ready to build? Run:** `INSTALL-AND-BUILD.bat`
