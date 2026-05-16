import { sharedConfig } from "./wdio.shared.conf";

export const config = {
  ...sharedConfig,
  capabilities: [
    {
      unhandledPromptBehavior: "accept",
      maxInstances: 1,
      browserName: "chrome",
      acceptInsecureCerts: true,
      "goog:chromeOptions": {
        args: [
          "--no-sandbox",
          "--disable-dev-shm-usage",
          "--disable-extensions",
          "--disable-web-security",
          "--headless=new",
          "--window-size=1920,1080",
          "--disable-gpu",
          "--ignore-certificate-errors"
        ]
      }
    }
  ]
};
