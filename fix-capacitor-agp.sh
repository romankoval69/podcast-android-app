#!/bin/bash

# Script to fix Capacitor AGP version compatibility issues
# This script patches the Capacitor Android library for AGP 7.2.1 compatibility

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

# Fix the main Capacitor Android library
if [ -f "node_modules/@capacitor/android/capacitor/build.gradle" ]; then
    echo "Patching Capacitor Android library for AGP 7.2.1..."
    
    # Make sure it uses AGP 7.2.1
    sed -i 's/com.android.tools.build:gradle:8.0.0/com.android.tools.build:gradle:7.2.1/g' node_modules/@capacitor/android/capacitor/build.gradle
    
    # Add namespace if not present
    if ! grep -q "namespace" node_modules/@capacitor/android/capacitor/build.gradle; then
        sed -i '/android {/a\    namespace "com.getcapacitor.android"' node_modules/@capacitor/android/capacitor/build.gradle
    fi
    
    # Add buildFeatures if not present
    if ! grep -q "buildFeatures" node_modules/@capacitor/android/capacitor/build.gradle; then
        sed -i '/testInstrumentationRunner/a\    }\n    \n    buildFeatures {\n        buildConfig true' node_modules/@capacitor/android/capacitor/build.gradle
    fi
fi

# Patch all plugin build files
for plugin in app device filesystem haptics keyboard network preferences splash-screen status-bar; do
    if [ -f "node_modules/@capacitor/$plugin/android/build.gradle" ]; then
        echo "Patching $plugin plugin..."
        sed -i 's/com.android.tools.build:gradle:8.0.0/com.android.tools.build:gradle:7.2.1/g' node_modules/@capacitor/$plugin/android/build.gradle
        sed -i 's/JavaVersion.VERSION_17/JavaVersion.VERSION_11/g' node_modules/@capacitor/$plugin/android/build.gradle
        
        # Add namespace if not present
        if ! grep -q "namespace" node_modules/@capacitor/$plugin/android/build.gradle; then
            sed -i '/android {/a\    namespace "com.capacitorjs.'$plugin'"' node_modules/@capacitor/$plugin/android/build.gradle
        fi
    fi
done

echo "✅ Capacitor AGP compatibility patches applied!"
echo "✅ All Capacitor libraries updated for AGP 7.2.1"
echo "Now try building your Android project in Android Studio."