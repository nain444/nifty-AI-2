# 📱 NIFTY AI Trader - Android APK

## 🚀 Quick Start

**Double-click:** `START-HERE.bat`

This will guide you through the entire APK build process!

---

## 📦 What You Get

A fully functional Android app with:
- ✅ AI-powered CALL/PUT/EXIT signals
- ✅ 8 Technical indicators (RSI, MACD, EMA, Bollinger, SuperTrend, ADX, Stochastic, VWAP)
- ✅ News sentiment analysis
- ✅ Sound + vibration alerts
- ✅ 3-day signal history
- ✅ Mobile-optimized UI
- ✅ Auto-refresh every 10 seconds
- ✅ Works offline after first load

---

## 🎯 Build Methods

### Option 1: Quick Build (Easiest)
```
Double-click: START-HERE.bat → Choose Option 1
Time: 10-15 minutes
```

### Option 2: GitHub Actions (No Setup)
```
Double-click: START-HERE.bat → Choose Option 3
Time: 5-10 minutes
Requires: GitHub account
```

### Option 3: Full SDK Setup
```
Double-click: START-HERE.bat → Choose Option 2
Time: 20-30 minutes
Best for: Multiple builds
```

---

## 📋 Requirements

- **Java 17+** ([Download](https://adoptium.net/temurin/releases/))
- **Node.js** (auto-installed by START-HERE.bat)
- **Internet connection** (for first build)

---

## 📲 Installation on Phone

After building APK:

1. Copy `NIFTY-AI-Trader.apk` to your phone
2. Open the APK file
3. Tap "Install"
4. Enable "Install from unknown sources" if prompted
5. Done! App icon will appear on home screen

---

## 🔧 Files Explained

| File | Purpose |
|------|---------|
| `START-HERE.bat` | **Main entry point** - Start here! |
| `QUICK-BUILD-APK.bat` | Quick build with minimal SDK |
| `BUILD-APK.bat` | Build with full SDK |
| `setup-android-sdk.bat` | Install Android SDK |
| `INSTALL-AND-BUILD.bat` | Menu-driven builder |
| `HOW-TO-BUILD-APK.md` | Complete documentation |

---

## ⚡ Quick Commands

```bash
# Install dependencies
npm install

# Sync Capacitor
npx cap sync android

# Build APK
cd android
gradlew.bat assembleDebug

# APK location
android\app\build\outputs\apk\debug\app-debug.apk
```

---

## 🌐 GitHub Actions (Cloud Build)

1. Create GitHub repo
2. Push code:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_REPO_URL
git push -u origin main
```
3. Go to Actions → Run "Build Android APK"
4. Download APK from Artifacts

---

## 📊 APK Info

- **Package:** com.nifty.aitrader
- **Name:** NIFTY AI Trader
- **Size:** ~15-20 MB
- **Min Android:** 5.0 (API 21)
- **Target:** Android 13 (API 33)

---

## ⚠️ Troubleshooting

### Java not found
```
Install Java 17: https://adoptium.net/temurin/releases/
Restart computer after installation
```

### Build failed
```
1. Check Java version: java -version
2. Check internet connection
3. Try: START-HERE.bat → Option 2 (Full SDK)
4. Disable antivirus temporarily
```

### App won't install on phone
```
1. Enable "Install from unknown sources"
2. Check storage space
3. Uninstall old version first
```

---

## 🎓 Learn More

- [Complete Build Guide](HOW-TO-BUILD-APK.md)
- [Capacitor Docs](https://capacitorjs.com/docs)
- [Android Developer Guide](https://developer.android.com/guide)

---

## 🚀 Ready to Build?

**Run:** `START-HERE.bat`

The wizard will guide you through everything!

---

## 📞 Support

If you encounter issues:
1. Read error messages carefully
2. Check [HOW-TO-BUILD-APK.md](HOW-TO-BUILD-APK.md)
3. Try different build method
4. Ensure Java 17+ installed

---

**Made with ❤️ for NIFTY traders**
