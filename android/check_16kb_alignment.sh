#!/bin/bash
APK_PATH="app/build/outputs/apk/release/app-release.apk"

echo "================================"
echo "16KB Page Size Alignment Check"
echo "================================"

if [ ! -f "$APK_PATH" ]; then
    echo "❌ APK not found at: $APK_PATH"
    echo "Please run: ./gradlew assembleRelease first"
    exit 1
fi

echo "✓ APK found: $APK_PATH"
echo ""
echo "Checking 16KB alignment..."

$ANDROID_HOME/build-tools/35.0.0/zipalign -c -P 16 -v 4 "$APK_PATH"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SUCCESS! APK is 16KB aligned!"
    echo "✅ Your app is ready for Android 15+ devices"
    echo "✅ Ready to submit to Google Play Store"
else
    echo ""
    echo "❌ APK is NOT 16KB aligned"
fi