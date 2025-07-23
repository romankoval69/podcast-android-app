# Gradle Compatibility Fixes for Android Build

## Issues Fixed

### 1. Gradle Version Compatibility
- **Problem**: Using Gradle 8.14.3 with AGP 8.11.1 causes compatibility issues with Gradle 9.0
- **Solution**: Downgraded to stable versions:
  - Gradle: 8.5 (from 8.14.3)
  - Android Gradle Plugin: 8.5.2 (from 8.11.1)

### 2. Deprecated Gradle Syntax
- **Problem**: `task clean(type: Delete)` syntax is deprecated
- **Solution**: Updated to `tasks.register('clean', Delete)`

### 3. Deprecated LintOptions
- **Problem**: `lintOptions` is deprecated in favor of `lint`
- **Solution**: Updated all `lintOptions` blocks to `lint`

### 4. Missing cordova.variables.gradle
- **Problem**: File referenced but not created during CI build
- **Solution**: Added automatic creation in GitHub Actions workflow

## Files Modified

1. `android/gradle/wrapper/gradle-wrapper.properties` - Gradle version
2. `android/build.gradle` - AGP version and task syntax
3. `android/capacitor-cordova-android-plugins/build.gradle` - lintOptions fix
4. `.github/workflows/android-build.yml` - Enhanced build steps
5. `android/app/capacitor.build.gradle` - Removed problematic import

## Manual Update Instructions

If you need to apply these fixes manually on GitHub:

### Update gradle-wrapper.properties
```properties
distributionUrl=https\://services.gradle.org/distributions/gradle-8.5-all.zip
```

### Update android/build.gradle
```gradle
classpath 'com.android.tools.build:gradle:8.5.2'
// ... and change the clean task to:
tasks.register('clean', Delete) {
    delete rootProject.buildDir
}
```

### Update android/capacitor-cordova-android-plugins/build.gradle
```gradle
// Change lintOptions to:
lint {
    abortOnError false
}
```

These changes ensure compatibility with modern Gradle versions while avoiding deprecated features.