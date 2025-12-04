# 📦 Build APK for Android - Complete Guide

## Option 1: Online Build (Easiest - No Android Studio Needed)

### Using AppGyver / Capacitor Cloud Build

1. **Install Capacitor CLI globally:**
```bash
npm install -g @capacitor/cli
```

2. **Sync the project:**
```bash
cd nifty-ai-mobile
npx cap sync android
```

3. **Use online build service:**
   - Go to https://ionic.io/appflow (Ionic Appflow)
   - Or use https://appcircle.io (Free tier available)
   - Upload your project
   - Build APK online

## Option 2: Local Build (Requires Android SDK)

### Step 1: Install Android SDK (Without Android Studio)

**Download Android Command Line Tools:**
1. Go to: https://developer.android.com/studio#command-tools
2. Download "Command line tools only" for Windows
3. Extract to: `C:\Android\cmdline-tools\latest`

**Set Environment Variables:**
```cmd
setx ANDROID_HOME "C:\Android"
setx PATH "%PATH%;C:\Android\cmdline-tools\latest\bin;C:\Android\platform-tools"
```

**Install SDK packages:**
```bash
cd C:\Android\cmdline-tools\latest\bin
sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.0"
sdkmanager --licenses
```

### Step 2: Build APK

```bash
cd nifty-ai-mobile\android
gradlew.bat assembleDebug
```

**APK Location:** `android\app\build\outputs\apk\debug\app-debug.apk`

## Option 3: Use Docker (Cross-platform)

Create `Dockerfile`:
```dockerfile
FROM openjdk:17-jdk
RUN apt-get update && apt-get install -y wget unzip
RUN wget https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip
RUN unzip commandlinetools-linux-9477386_latest.zip -d /opt/android-sdk
ENV ANDROID_HOME=/opt/android-sdk
RUN yes | /opt/android-sdk/cmdline-tools/bin/sdkmanager --sdk_root=$ANDROID_HOME "platform-tools" "platforms;android-33" "build-tools;33.0.0"
WORKDIR /app
COPY . .
RUN cd android && ./gradlew assembleDebug
```

Build:
```bash
docker build -t nifty-apk-builder .
docker run -v ${PWD}:/app nifty-apk-builder
```

## Option 4: GitHub Actions (Automated Cloud Build)

I'll create a GitHub Actions workflow that builds APK automatically!

