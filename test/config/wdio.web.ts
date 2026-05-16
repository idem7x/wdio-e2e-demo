import { config as sharedConfig } from "./wdio.conf";

export const config = {
  ...sharedConfig,
  specs: ["../specs/web/**/*.ts"],
  suite: "Web"
};
