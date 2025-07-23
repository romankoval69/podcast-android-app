#!/bin/bash

# Fix Capacitor plugin namespaces for Android build
PLUGINS=("app" "device" "filesystem" "haptics" "keyboard" "network" "preferences" "splash-screen" "status-bar")

for plugin in "${PLUGINS[@]}"; do
    # Convert kebab-case to valid Java package name
    package_name=$(echo "$plugin" | sed 's/-//')
    
    # Create build.gradle for each plugin with correct namespace
    cat > "node_modules/@capacitor/$plugin/android/build.gradle" << EOF
apply plugin: 'com.android.library'

android {
    namespace "com.capacitorjs.$package_name"
    compileSdk 35

    defaultConfig {
        minSdk 24
        targetSdk 35
        versionCode 1
        versionName "1.0"
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }
    
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }
    
    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}

repositories {
    google()
    mavenCentral()
}

dependencies {
    implementation project(':capacitor-android')
    implementation 'androidx.appcompat:appcompat:1.7.0'
    testImplementation 'junit:junit:4.13.2'
}
EOF
    
    # Create AndroidManifest.xml for each plugin
    cat > "node_modules/@capacitor/$plugin/android/src/main/AndroidManifest.xml" << EOF
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.capacitorjs.$package_name">
</manifest>
EOF

done

echo "Fixed Capacitor plugin namespaces for Android build"