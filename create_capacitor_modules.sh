#!/bin/bash

# Create basic Capacitor plugin modules for Android build
PLUGINS=("app" "device" "filesystem" "haptics" "keyboard" "network" "preferences" "splash-screen" "status-bar")

for plugin in "${PLUGINS[@]}"; do
    mkdir -p "node_modules/@capacitor/$plugin/android/src/main"
    
    # Create build.gradle for each plugin
    cat > "node_modules/@capacitor/$plugin/android/build.gradle" << EOF
apply plugin: 'com.android.library'

android {
    namespace "com.capacitorjs.$plugin"
    compileSdk project.hasProperty('compileSdkVersion') ? rootProject.ext.compileSdkVersion : 35

    defaultConfig {
        minSdk project.hasProperty('minSdkVersion') ? rootProject.ext.minSdkVersion : 22
        targetSdk project.hasProperty('targetSdkVersion') ? rootProject.ext.targetSdkVersion : 35
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
    implementation "androidx.appcompat:appcompat:\$androidxAppCompatVersion"
    testImplementation "junit:junit:4.13.2"
}
EOF
    
    # Create AndroidManifest.xml for each plugin
    cat > "node_modules/@capacitor/$plugin/android/src/main/AndroidManifest.xml" << EOF
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.capacitorjs.$plugin">
</manifest>
EOF

done

echo "Created Capacitor plugin modules for Android build"