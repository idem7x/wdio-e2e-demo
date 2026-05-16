# Sample APK

This folder is intentionally empty in the repo. To run the Android suite,
download the Appium ApiDemos sample APK and drop it here:

```bash
curl -L -o test/resources/apk/ApiDemos-debug.apk \
  https://github.com/appium/appium/raw/master/packages/appium/sample-code/apps/ApiDemos-debug.apk
```

`.env` defaults point at `ApiDemos-debug.apk` with package
`io.appium.android.apis` and activity `.ApiDemos`.
