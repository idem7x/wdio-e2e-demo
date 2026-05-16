import { config as androidConfig } from "./wdio.android";

// Same Android config, but without the local @wdio/appium-service:
// Appium runs inside the docker-compose stack on the host port 4723.
export const config = {
  ...androidConfig,
  services: (androidConfig.services ?? []).filter(
    (s: string | [string, object]) =>
      (Array.isArray(s) ? s[0] : s) !== "appium"
  )
};
