import { sharedConfig } from "./wdio.shared.conf";
import { join } from "node:path";
import video from "wdio-video-reporter";
import EnvVariables from "data/env.variables";

export const config = {
  ...sharedConfig,
  reporters: [
    ...sharedConfig.reporters,
    [
      video,
      {
        saveAllVideos: true,
        videoSlowdownMultiplier: 5
      }
    ]
  ],

  hostname: EnvVariables.APPIUM_HOST,
  port: Number(EnvVariables.APPIUM_PORT),

  services: ["appium"],

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
