#!/usr/bin/env bash
set -euo pipefail

APK_DIR="$(cd "$(dirname "$0")/.." && pwd)/test/resources/apk"
APK_NAME="${ANDROID_APK:-ApiDemos-debug.apk}"
APK_PATH="$APK_DIR/$APK_NAME"
APK_URL="https://github.com/appium/appium/raw/master/packages/appium/sample-code/apps/ApiDemos-debug.apk"

if [[ -f "$APK_PATH" ]]; then
  echo "APK already present: $APK_PATH"
  exit 0
fi

echo "Downloading $APK_NAME → $APK_PATH"
mkdir -p "$APK_DIR"
curl -fL --retry 3 -o "$APK_PATH" "$APK_URL"
echo "Done."
