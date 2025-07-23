# Capacitor Android Studio Setup Guide

## Common Issues and Solutions

### Issue 1: Project Won't Open
**Problem**: Android Studio doesn't recognize the project structure
**Solution**: 
- Open Android Studio
- Choose "Open an Existing Project"
- Navigate to and select the `android` folder (not the root project folder)
- Let Android Studio import and sync

### Issue 2: Gradle Sync Fails
**Problem**: Missing dependencies or version conflicts
**Solution**:
- File → Invalidate Caches and Restart
- Clean Project (Build → Clean Project)
- Rebuild Project (Build → Rebuild Project)

### Issue 3: SDK Issues
**Problem**: Android SDK not found or licenses not accepted
**Solution**:
- Tools → SDK Manager
- Install missing SDK components
- Accept all licenses in the SDK Manager

### Issue 4: Capacitor Dependencies Missing
**Problem**: @capacitor modules not found
**Solution**:
- Ensure `node_modules` exists in project root
- Run `npm install` in project root
- Run `npx capacitor sync android`

### Issue 5: Build Errors
**Problem**: Various compilation errors
**Solution**:
- Check that all build.gradle files use consistent versions
- Verify Java version (should be Java 17)
- Check Android Gradle Plugin version (should be 8.11.1)

## Step-by-Step Android Studio Setup

1. **Install Android Studio Narwhal 2025.1.1+**
2. **Open Project**: File → Open → Select `android` folder
3. **Wait for Sync**: Let Gradle sync complete
4. **Install SDK**: Follow prompts to install missing SDK components
5. **Accept Licenses**: Accept all Android SDK licenses
6. **Build APK**: Build → Build Bundle(s) / APK(s) → Build APK(s)

## Most Common Android Studio Capacitor Issues

### 1. Java Version Conflicts (Most Common)
**Problem**: Capacitor auto-generates Java 21 requirements, but your system uses Java 17
**Fix**:
- In Android Studio: File → Settings → Build Tools → Gradle → Gradle JDK → Choose "Android Studio JDK"
- Or set JAVA_HOME to Android Studio's JDK path

### 2. "Plugin Not Implemented" Errors
**Problem**: Capacitor can't find or inject plugins
**Fix**:
```bash
npx cap sync android
# Then in Android Studio: Click "Sync Project with Gradle Files" (elephant icon)
```

### 3. "Unsupported Modules Detected"
**Problem**: Android Studio doesn't recognize capacitor-android-plugins
**Fix**:
- Delete `android/.idea` folder
- Reopen project in Android Studio
- Let it re-import everything

### 4. AndroidX vs Support Library Conflicts
**Problem**: Old dependencies causing build failures
**Fix**:
```bash
npm install jetifier
npx jetify
npx cap sync android
```

## Nuclear Option: Complete Rebuild

If nothing works, try this complete reset:

```bash
# 1. Remove Android platform
rm -rf android

# 2. Update Capacitor
npm install @capacitor/cli@latest

# 3. Re-add platform
npx cap add android
npx cap sync android

# 4. Open in Android Studio (select android folder)
```

## Alternative: Command Line Build (Skip Android Studio)

If Android Studio continues to have issues, build directly:

```bash
# In project root
npm install
npx capacitor sync android

# In android folder
./gradlew assembleDebug
```

The APK will be created at: `android/app/build/outputs/apk/debug/app-debug.apk`

## Diagnostic Commands
```bash
# Check for version conflicts
npx cap doctor

# Force sync everything
npx cap sync android --force

# Check Gradle wrapper
cd android && ./gradlew --version
```