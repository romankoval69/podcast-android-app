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

# Create a custom build.gradle override for the main capacitor library
cat > android/capacitor-android-override.gradle << 'EOF'
// Custom AGP override for Capacitor Android compatibility
buildscript {
    dependencies {
        classpath 'com.android.tools.build:gradle:7.2.1'
    }
}

// Override for all capacitor modules
allprojects {
    afterEvaluate { project ->
        if (project.name.startsWith('capacitor-')) {
            android {
                compileSdkVersion 33
                defaultConfig {
                    minSdkVersion 22
                    targetSdkVersion 33
                }
                compileOptions {
                    sourceCompatibility JavaVersion.VERSION_11
                    targetCompatibility JavaVersion.VERSION_11
                }
            }
        }
    }
}
EOF

echo "✅ Capacitor AGP compatibility patches applied!"
echo "Now try building your Android project in Android Studio."