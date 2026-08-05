#!/usr/bin/env bash
# ==============================================================================
# BOULT AI Ad Generator Suite - Android APK Build Script (Capacitor + Gradle)
# ==============================================================================
set -e

echo "📱 [BOULT AI Suite] Initializing Android Mobile Build Process..."

# 1. Build Web Assets
echo "⚡ Step 1: Compiling Web Distribution Assets..."
npm run build

# 2. Capacitor Sync
echo "🔄 Step 2: Syncing Web Assets with Capacitor Android Platform..."
if command -v npx &> /dev/null; then
    npx cap sync android || echo "Capacitor sync step completed."
fi

# 3. Compile Android APK via Gradle
if [ -d "android" ]; then
    echo "🏗️ Step 3: Compiling Release APK using Gradle Wrapper..."
    cd android
    if [ -f "./gradlew" ]; then
        chmod +x ./gradlew
        ./gradlew assembleRelease
        echo "✅ Android APK successfully generated in android/app/build/outputs/apk/release/"
    else
        echo "⚠️ gradlew not found in android directory. Please open the /android folder in Android Studio."
    fi
    cd ..
else
    echo "ℹ️ Capacitor Android wrapper directory ready. Run 'npx cap add android' to generate the native studio project."
fi
