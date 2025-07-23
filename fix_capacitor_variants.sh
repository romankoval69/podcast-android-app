#!/bin/bash

echo "Creating proper Capacitor Android modules with build variants..."

# Create the main capacitor-android module with proper variants
mkdir -p node_modules/@capacitor/android/capacitor/src/main/java/com/getcapacitor

cat > node_modules/@capacitor/android/capacitor/build.gradle << 'EOF'
apply plugin: 'com.android.library'

android {
    namespace "com.getcapacitor.android"
    compileSdk 35

    defaultConfig {
        minSdk 24
        targetSdk 35
        versionCode 1
        versionName "1.0"
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }
    
    buildTypes {
        debug {
            minifyEnabled false
        }
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }
    
    publishing {
        singleVariant('release') {
            withSourcesJar()
        }
    }
}

repositories {
    google()
    mavenCentral()
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.7.1'
    implementation 'androidx.core:core:1.13.1'
    implementation 'androidx.webkit:webkit:1.12.1'
    implementation 'org.apache.cordova:framework:14.0.1'
}
EOF

# Create plugins with proper variants
PLUGINS=("app" "device" "filesystem" "haptics" "keyboard" "network" "preferences" "splash-screen" "status-bar")

for plugin in "${PLUGINS[@]}"; do
    package_name=$(echo "$plugin" | sed 's/-//')
    mkdir -p "node_modules/@capacitor/$plugin/android/src/main/java/com/capacitorjs/$package_name"
    
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
    
    buildTypes {
        debug {
            minifyEnabled false
        }
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }
    
    publishing {
        singleVariant('release') {
            withSourcesJar()
        }
    }
}

repositories {
    google()
    mavenCentral()
}

dependencies {
    implementation project(':capacitor-android')
    implementation 'androidx.appcompat:appcompat:1.7.1'
}
EOF

    cat > "node_modules/@capacitor/$plugin/android/src/main/AndroidManifest.xml" << EOF
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.capacitorjs.$package_name">
</manifest>
EOF

done

echo "Fixed Capacitor modules with proper build variants"