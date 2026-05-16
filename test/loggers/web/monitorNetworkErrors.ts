import logger from "utils/logger";
import allureReportUtil from "utils/allure.report.util";

/**
 * Subscribe via WebDriver BiDi to network responses and flag any 4xx/5xx
 * as warnings on the current test, with full response attached to Allure.
 */
export async function monitorNetworkErrors(browser: any): Promise<void> {
  logger.info("Setting up browser network error monitoring...");
  await browser.sessionSubscribe({ events: ["network.responseCompleted"] });

  browser.on("network.responseCompleted", async (params: any) => {
    const { status, url, statusText } = params.response;

    if (status >= 400 && status < 600) {
      const errorType = status < 500 ? "CLIENT" : "SERVER";
      const label = `${errorType} NETWORK ERROR [${params.request.method}][${url}][${status}][${statusText}]`;
      await allureReportUtil.addJSON(label, params.response);
      try {
        global.emailReportUtil?.addWarningMessage(label);
      } catch {
        // emailReportUtil may not have a current test set during setup
      }
    }
  });
}
