import { sharedConfig } from "./wdio.shared.conf";
import { join } from "node:path";
import EnvVariables from "data/env.variables";

// Self-contained Android config for the dockerised stack.
//
// Why duplicate wdio.android.ts instead of re-exporting it?
//   wdio.android.ts imports `wdio-video-reporter`, which loads
//   `@ffmpeg-installer/ffmpeg` at module-eval time. On Linux CI the
//   per-platform binary (`@ffmpeg-installer/linux-x64`) is missing from
//   the install tree (lockfile was generated on macOS), so the import
//   throws and the whole wdio config fails to load. Avoiding the import
//   side-steps the problem entirely — the docker run doesn't need video,
//   it has allure + spec reporter.
export const config = {
  ...sharedConfig,

  hostname: EnvVariables.APPIUM_HOST,
  port: Number(EnvVariables.APPIUM_PORT),

  // Appium runs inside the docker container; no local @wdio/appium-service.
  services: [],

  specs: ["../specs/android/**/*.ts"],

  capabilities: [
    {
      platformName: "Android",
      maxInstances: 1,
      "appium:orientation": "PORTRAIT",
      "appium:automationName": "UiAutomator2",
      "appium:autoGrantPermissions": true,
      "appium:noReset": false,
      "appium:fullReset": true,
      "appium:allowTestPackages": true,
      "appium:adbExecTimeout": 60000,
      "appium:appPackage": EnvVariables.ANDROID_APP_PACKAGE,
      "appium:appActivity": EnvVariables.ANDROID_APP_ACTIVITY,
      "appium:uiautomator2ServerInstallTimeout": 60000,
      "appium:androidInstallTimeout": 120000,
      "appium:app": join(
        EnvVariables.ANDROID_APK_DIR,
        EnvVariables.ANDROID_APK
      ),
      "appium:newCommandTimeout": 240
    }
  ],
  suite: "Android"
};
