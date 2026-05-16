import logger from "utils/logger";
import { BrowserType } from "types/browserType";
import SoftAssertUtil from "utils/soft.assert.util";

function formatTestLog(message: string, testName: string): string {
  return `************** ${message} [${testName}] **************`;
}

async function runTest(
  testName: string,
  testFn: () => Promise<void>
): Promise<void> {
  logger.info(formatTestLog("Test started", testName));
  try {
    SoftAssertUtil.clearErrors();
    await testFn();
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.error(`Error in test [${testName}]: ${msg}`);
    throw error;
  } finally {
    await SoftAssertUtil.assertAll();
    logger.info(formatTestLog("Test finished", testName));
  }
}

/**
 * For mix specs: binds global.browser to the requested browser instance
 * (`global.web` or `global.android`) before the test body runs.
 */
function multiBrowserIt(
  browserType: BrowserType,
  testName: string,
  testFn: () => Promise<void>
): void {
  it(testName, () => {
    return (async () => {
      global.browser = global[browserType];
      await runTest(testName, testFn);
    })();
  });
}

function step(testName: string, testFn: () => Promise<void>): void {
  it(testName, () => {
    return runTest(testName, testFn);
  });
}

export { multiBrowserIt, step };
