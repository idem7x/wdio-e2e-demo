import { Status } from "allure-js-commons";
import logger from "./logger";
import allure from "@wdio/allure-reporter";
import { Buffer } from "buffer";

const {
  step,
  addStep,
  addFeature,
  addSeverity,
  addIssue,
  addAttachment,
  addLabel,
  addStory,
  startStep,
  endStep
} = allure;

class AllureReportUtil {
  public async step(name: string, body: any, skipLog?: boolean): Promise<void> {
    if (!skipLog) logger.info(name);
    await step(name, body);
  }

  public async addStep(name: string, skipLog?: boolean): Promise<void> {
    if (!skipLog) logger.info(name);
    await addStep(name);
  }

  public async startStep(stepName: string): Promise<void> {
    await startStep(stepName);
  }

  public async endStep(status?: Status): Promise<void> {
    await endStep(status);
  }

  public async addFeature(featureName: string): Promise<void> {
    logger.info(
      `************** Start test suite for [${featureName}] **************`
    );
    await addFeature(featureName);
  }

  public async addLabel(name: string, value: string): Promise<void> {
    await addLabel(name, value);
  }

  public async addStory(storyName: string): Promise<void> {
    await addStory(storyName);
  }

  public async addSeverity(severity: string): Promise<void> {
    await addSeverity(severity);
  }

  public async addIssue(issue: string): Promise<void> {
    await addIssue(issue);
    global.emailReportUtil?.setCurrentTestIssueId(issue);
  }

  public async addPng(
    name: string,
    content: string | Buffer | object
  ): Promise<void> {
    await this.addAttachment(name, content, "image/png");
  }

  public async addJSON(name: string, content: string | unknown): Promise<void> {
    await this.addAttachment(
      name,
      JSON.stringify(content, null, 2),
      "application/json"
    );
  }

  public async addText(name: string, content: string): Promise<void> {
    await this.addAttachment(name, content, "text/plain");
  }

  public async addAttachment(
    name: string,
    content: string | Buffer | object,
    type: string
  ): Promise<void> {
    await addAttachment(name, content, type);
  }
}

export default new AllureReportUtil();
