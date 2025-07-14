@echo off
REM Script to fix Capacitor AGP version compatibility issues
REM This script patches the Capacitor Android library for AGP 7.2.1 compatibility

echo 🔧 Fixing Capacitor AGP version compatibility...

REM Fix capacitor-cordova-android-plugins build.gradle
if exist "android\capacitor-cordova-android-plugins\build.gradle" (
    echo Patching capacitor-cordova-android-plugins/build.gradle...
    powershell -Command "(Get-Content 'android\capacitor-cordova-android-plugins\build.gradle') -replace 'com.android.tools.build:gradle:8.0.0', 'com.android.tools.build:gradle:7.2.1' | Set-Content 'android\capacitor-cordova-android-plugins\build.gradle'"
    powershell -Command "(Get-Content 'android\capacitor-cordova-android-plugins\build.gradle') -replace 'JavaVersion.VERSION_17', 'JavaVersion.VERSION_11' | Set-Content 'android\capacitor-cordova-android-plugins\build.gradle'"
)

REM Fix capacitor.build.gradle
if exist "android\app\capacitor.build.gradle" (
    echo Patching app/capacitor.build.gradle...
    powershell -Command "(Get-Content 'android\app\capacitor.build.gradle') -replace 'JavaVersion.VERSION_17', 'JavaVersion.VERSION_11' | Set-Content 'android\app\capacitor.build.gradle'"
)

REM Fix the main Capacitor Android library
if exist "node_modules\@capacitor\android\capacitor\build.gradle" (
    echo Patching Capacitor Android library for AGP 7.2.1...
    
    REM Make sure it uses AGP 7.2.1
    powershell -Command "(Get-Content 'node_modules\@capacitor\android\capacitor\build.gradle') -replace 'com.android.tools.build:gradle:8.0.0', 'com.android.tools.build:gradle:7.2.1' | Set-Content 'node_modules\@capacitor\android\capacitor\build.gradle'"
    
    REM Add namespace if not present
    powershell -Command "$content = Get-Content 'node_modules\@capacitor\android\capacitor\build.gradle'; if ($content -notmatch 'namespace') { $content = $content -replace 'android \{', 'android {`n    namespace \"com.getcapacitor.android\"' } | Set-Content 'node_modules\@capacitor\android\capacitor\build.gradle'"
)

REM Patch all plugin build files
for %%p in (app device filesystem haptics keyboard network preferences splash-screen status-bar) do (
    if exist "node_modules\@capacitor\%%p\android\build.gradle" (
        echo Patching %%p plugin...
        powershell -Command "(Get-Content 'node_modules\@capacitor\%%p\android\build.gradle') -replace 'com.android.tools.build:gradle:8.0.0', 'com.android.tools.build:gradle:7.2.1' | Set-Content 'node_modules\@capacitor\%%p\android\build.gradle'"
        powershell -Command "(Get-Content 'node_modules\@capacitor\%%p\android\build.gradle') -replace 'JavaVersion.VERSION_17', 'JavaVersion.VERSION_11' | Set-Content 'node_modules\@capacitor\%%p\android\build.gradle'"
        
        REM Add namespace if not present
        powershell -Command "$content = Get-Content 'node_modules\@capacitor\%%p\android\build.gradle'; if ($content -notmatch 'namespace') { $content = $content -replace 'android \{', 'android {`n    namespace \"com.capacitorjs.%%p\"' } | Set-Content 'node_modules\@capacitor\%%p\android\build.gradle'"
    )
)

echo ✅ Capacitor AGP compatibility patches applied!
echo ✅ All Capacitor libraries updated for AGP 7.2.1
echo Now try building your Android project in Android Studio.
pause