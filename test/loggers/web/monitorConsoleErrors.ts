import logger from "utils/logger";
import allureReportUtil from "utils/allure.report.util";

/**
 * Subscribe via WebDriver BiDi to browser-level `log.entryAdded` events
 * and attach any `error` entries to the current Allure test.
 */
export async function monitorConsoleErrors(browser: any): Promise<void> {
  logger.info("Setting up browser console error monitoring...");
  await browser.sessionSubscribe({ events: ["log.entryAdded"] });

  browser.on("log.entryAdded", async (message: any) => {
    if (message.level === "error") {
      await allureReportUtil.addText(
        "Browser console error message",
        message.text
      );
    }
  });
}
