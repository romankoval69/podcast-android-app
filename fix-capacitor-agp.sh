#!/bin/bash

# Script to fix Capacitor AGP version compatibility issues
# This script patches the generated Capacitor plugin files to use AGP 7.2.1

echo "🔧 Fixing Capacitor AGP version compatibility..."

# Fix capacitor-cordova-android-plugins build.gradle
if [ -f "android/capacitor-cordova-android-plugins/build.gradle" ]; then
    echo "Patching capacitor-cordova-android-plugins/build.gradle..."
    sed -i 's/com.android.tools.build:gradle:8.0.0/com.android.tools.build:gradle:7.2.1/g' android/capacitor-cordova-android-plugins/build.gradle
    sed -i 's/JavaVersion.VERSION_17/JavaVersion.VERSION_11/g' android/capacitor-cordova-android-plugins/build.gradle
fi

# Fix capacitor.build.gradle
if [ -f "android/app/capacitor.build.gradle" ]; then
    echo "Patching app/capacitor.build.gradle..."
    sed -i 's/JavaVersion.VERSION_17/JavaVersion.VERSION_11/g' android/app/capacitor.build.gradle
fi

# Remove the override file if it exists to prevent conflicts
if [ -f "android/capacitor-android-override.gradle" ]; then
    rm android/capacitor-android-override.gradle
fi

# Ensure the main build.gradle doesn't reference the override
sed -i '/apply from: "capacitor-android-override.gradle"/d' android/build.gradle

echo "✅ Capacitor AGP compatibility patches applied!"
echo "Now try building your Android project in Android Studio."