import { sharedConfig } from "./wdio.shared.conf";
import { join } from "node:path";
import EnvVariables from "data/env.variables";

/**
 * Mixed capability config — runs Chrome and Android Appium in parallel under
 * the same Mocha process. Use `multiBrowserIt(BrowserType.WEB, ...)` in specs
 * to bind `global.browser` to the right instance per step.
 */
export const config = {
  ...sharedConfig,
  specs: ["../specs/mix/**/*.ts"],
  capabilities: {
    web: {
      capabilities: {
        unhandledPromptBehavior: "accept",
        browserName: "chrome",
        acceptInsecureCerts: true,
        "goog:chromeOptions": {
          args: [
            "--no-sandbox",
            "--disable-dev-shm-usage",
            "--headless=new",
            "--window-size=1920,1080",
            "--disable-gpu"
          ]
        }
      } as const
    },
    android: {
      hostname: EnvVariables.APPIUM_HOST,
      port: Number(EnvVariables.APPIUM_PORT),
      capabilities: {
        platformName: "Android",
        "appium:orientation": "PORTRAIT",
        "appium:automationName": "UiAutomator2",
        "appium:autoGrantPermissions": true,
        "appium:noReset": false,
        "appium:fullReset": true,
        "appium:allowTestPackages": true,
        "appium:appPackage": EnvVariables.ANDROID_APP_PACKAGE,
        "appium:appActivity": EnvVariables.ANDROID_APP_ACTIVITY,
        "appium:app": join(
          EnvVariables.ANDROID_APK_DIR,
          EnvVariables.ANDROID_APK
        ),
        "appium:newCommandTimeout": 240
      } as const
    }
  },
  suite: "Mix"
};
