import allure from "allure-commandline";
import fs from "fs-extra";
import path from "path";
import { Buffer } from "buffer";
import EnvVariables from "data/env.variables";
import allureReportUtil from "utils/allure.report.util";
import logger from "utils/logger";
import { EmailReportUtil, TestResult } from "utils/emailReportUtil";
import { EmailService } from "utils/emailUtil";
import { monitorConsoleErrors } from "test/loggers/web/monitorConsoleErrors";
import { monitorNetworkErrors } from "test/loggers/web/monitorNetworkErrors";

const reportsFolder = EnvVariables.REPORTS_FOLDER;
const wdioReportPath = reportsFolder
  ? reportsFolder + "/report/wdio/"
  : path.resolve("report/wdio");
const allureResultsPath = reportsFolder
  ? reportsFolder + "report/allure-results"
  : "report/allure-results";
const allureReportPath = reportsFolder
  ? reportsFolder + "allure-report"
  : "allure-report";
const testResultsPath = path.join(wdioReportPath, "test-results.json");

const emailConfig = {
  EMAIL_TO: EnvVariables.EMAIL_MAIL_TO,
  EMAIL_FROM: EnvVariables.EMAIL_MAIL_FROM,
  ALLURE_BASE_URL: EnvVariables.ALLURE_URL
};

export const sharedConfig = {
  reporterSyncInterval: 500,
  reporterSyncTimeout: 20000,
  runner: "local",
  exclude: [],
  maxInstances: 1,
  logLevel: "info" as const,
  outputDir: wdioReportPath,
  logLevels: {},
  bail: 0,
  baseUrl: EnvVariables.HOST_WEB,
  waitforTimeout: EnvVariables.TIMEOUT ? Number(EnvVariables.TIMEOUT) : 15000,
  waitforInterval: 500,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  retry: EnvVariables.RETRY ? Number(EnvVariables.RETRY) : 1,
  services: [] as any[],
  framework: "mocha" as const,
  specFileRetries: EnvVariables.RETRY ? Number(EnvVariables.RETRY) : 1,
  reporters: [
    "spec",
    [
      "allure",
      {
        outputDir: allureResultsPath,
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: true,
        addConsoleLogs: true
      }
    ]
  ] as any,
  mochaOpts: {
    ui: "bdd",
    timeout: 600000
  },

  beforeSession: async () => {
    global.emailReportUtil = new EmailReportUtil();

    fs.ensureDirSync(path.dirname(testResultsPath));
    if (!fs.existsSync(testResultsPath)) {
      fs.writeFileSync(testResultsPath, JSON.stringify([]));
    }
  },

  before: async (capabilities: any, _specs: string[], browserInstance: any) => {
    if (capabilities.browserName) {
      try {
        await monitorConsoleErrors(browserInstance);
        await monitorNetworkErrors(browserInstance);
      } catch (e) {
        logger.warn(`Failed to attach BiDi listeners: ${e}`);
      }
    }
  },

  beforeTest: async (test: {
    title: string;
    file?: string;
    parent?: string;
  }) => {
    const fileName = test.file ? path.basename(test.file) : null;
    const suite = test.parent
      ? fileName
        ? `${test.parent} (${fileName})`
        : test.parent
      : fileName
        ? path.basename(test.file!, path.extname(test.file!))
        : "unknown";
    global.emailReportUtil.setCurrentTest(suite, test.title);
  },

  afterTest: async (
    test: { title: string; file?: string; parent?: string },
    _context: any,
    { error, passed, retries }: { error?: any; passed?: any; retries?: any }
  ) => {
    const fileName = test.file ? path.basename(test.file) : null;
    const suite = test.parent
      ? fileName
        ? `${test.parent} (${fileName})`
        : test.parent
      : fileName
        ? path.basename(test.file!, path.extname(test.file!))
        : "unknown";
    const status = passed ? "passed" : "failed";

    try {
      const screenshot = await browser.takeScreenshot();
      await allureReportUtil.addPng(
        "Screenshot",
        Buffer.from(screenshot, "base64")
      );
    } catch (e) {
      logger.warn(`Failed to capture screenshot: ${e}`);
    }

    const testResult: TestResult = {
      suite,
      name: test.title,
      status,
      error: error
        ? error.message
          ? error.message
          : JSON.stringify(error)
        : "",
      retryCount: retries.attempts,
      warnings: global.emailReportUtil.getCurrentTestWarnings(
        suite,
        test.title
      ),
      issueId: global.emailReportUtil.getCurrentTestIssueId(suite, test.title)
    };

    try {
      const existing: TestResult[] = fs.existsSync(testResultsPath)
        ? JSON.parse(fs.readFileSync(testResultsPath, "utf8"))
        : [];
      const idx = existing.findIndex(
        (r) => r.suite === testResult.suite && r.name === testResult.name
      );
      if (idx >= 0) {
        testResult.retryCount = (existing[idx].retryCount || 0) + 1;
        existing[idx] = testResult;
      } else {
        testResult.retryCount = 0;
        existing.push(testResult);
      }
      fs.writeFileSync(testResultsPath, JSON.stringify(existing, null, 2));
    } catch (e) {
      logger.error("Error saving test result:", e);
    }
  },

  onComplete: async (_exitCode: number, config: any) => {
    try {
      const generation = allure([
        "generate",
        allureResultsPath,
        "--clean",
        "-o",
        allureReportPath
      ]);

      await new Promise<void>((resolve, reject) => {
        generation.on("exit", (code: number) =>
          code !== 0 ? reject("Allure failed") : resolve()
        );
      });
      logger.info("Allure report generated successfully");

      const testResults: TestResult[] = fs.existsSync(testResultsPath)
        ? JSON.parse(fs.readFileSync(testResultsPath, "utf8"))
        : [];

      if (testResults.length === 0 || !emailConfig.EMAIL_TO) {
        logger.info("Skipping email report (no results or no recipient)");
        return;
      }

      if (!global.emailReportUtil) {
        global.emailReportUtil = new EmailReportUtil();
      }

      const html = global.emailReportUtil.generateEmailReport(
        testResults,
        emailConfig.ALLURE_BASE_URL || ""
      );
      const subject = global.emailReportUtil.generateEmailSubject(
        testResults,
        config.suite || "Demo"
      );

      const emailService = new EmailService();
      await emailService.sendEmail({
        to: emailConfig.EMAIL_TO,
        subject,
        html,
        from: emailConfig.EMAIL_FROM
      });
      logger.info(`Email report sent to ${emailConfig.EMAIL_TO}`);

      fs.removeSync(testResultsPath);
    } catch (error) {
      logger.error("Error in onComplete hook:", error);
    }
  }
};

export { wdioReportPath, allureResultsPath, allureReportPath };
